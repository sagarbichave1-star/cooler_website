"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  Inbox,
  KeyRound,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { Brand } from "./brand";
import { CoolerVisual } from "./cooler-visual";
import { products, type Product } from "@/data/products";
import { productInput } from "@/lib/admin-validation";

type DraftProduct = { slug: string; published: boolean; data: Product };
const initialDrafts = products.map((data) => ({
  slug: data.slug,
  published: false,
  data,
}));
const emptyProduct: Product = {
  slug: "",
  name: "",
  category: "Desert",
  summary: "",
  intendedFor: "",
  tone: "ocean",
};
const fields = [
  ["name", "Product name", 120, true],
  ["slug", "Product ID", 80, true],
  ["category", "Category", 60, true],
  ["intendedFor", "Suggested setting", 160, true],
  ["model", "Model number", 160, false],
  ["tankCapacity", "Tank capacity", 160, false],
  ["coolingArea", "Cooling area", 160, false],
  ["powerConsumption", "Power consumption", 160, false],
  ["dimensions", "Dimensions", 160, false],
  ["imageUrl", "Image URL (HTTPS)", 600, false],
] as const;

export function AdminPanel({
  authenticated,
  configured,
}: {
  authenticated: boolean;
  configured: boolean;
}) {
  const [signedIn, setSignedIn] = useState(authenticated);
  const [visibleKey, setVisibleKey] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"products" | "enquiries">("products");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drafts, setDrafts] = useState<DraftProduct[]>(initialDrafts);
  const [editing, setEditing] = useState<DraftProduct | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const editor = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        });
        const result = await response.json();
        if (active && response.ok && !result.authenticated) {
          setSignedIn(false);
          setDrafts(initialDrafts);
          setError("Your session expired. Please sign in again.");
        }
      } catch {
        /* Keep the local draft while temporarily offline. */
      }
    }
    const interval = window.setInterval(checkSession, 60000);
    window.addEventListener("focus", checkSession);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", checkSession);
    };
  }, [signedIn]);

  useEffect(() => {
    if (editing && signedIn) editor.current?.showModal();
  }, [editing, signedIn]);

  async function updateSession(key?: FormDataEntryValue | null) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: key === undefined ? "DELETE" : "POST",
        signal: AbortSignal.timeout(15000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not update your session.");
      setSignedIn(body.authenticated === true);
      setDrafts(initialDrafts);
      setNotice("");
      setEditing(null);
      return true;
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Could not update your session. Try again.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (await updateSession(new FormData(form).get("key"))) form.reset();
  }

  function openEditor(product?: DraftProduct) {
    setOriginalSlug(product?.slug || null);
    setEditing(
      product || { slug: "", published: false, data: { ...emptyProduct } },
    );
    setError("");
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      const product = productInput({
        ...Object.fromEntries(form),
        published: form.get("published") === "on",
      });
      if (
        drafts.some(
          (item) => item.slug === product.slug && item.slug !== originalSlug,
        )
      )
        throw new Error("That product ID is already in use.");
      setDrafts((items) =>
        originalSlug
          ? items.map((item) => (item.slug === originalSlug ? product : item))
          : [...items, product],
      );
      editor.current?.close();
      setEditing(null);
      setNotice(
        "Preview updated. Connect storage to save and publish these changes to the website.",
      );
    } catch (issue) {
      setError((issue as Error).message);
    }
  }

  const filtered = drafts.filter((item) => {
    const matchesText = `${item.data.name} ${item.data.category} ${item.slug}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return (
      matchesText &&
      (statusFilter === "all" ||
        (statusFilter === "published" ? item.published : !item.published))
    );
  });

  if (!signedIn)
    return (
      <section className="admin-login">
        <div className="admin-login-story">
          <Brand />
          <div>
            <p className="eyebrow light">Owner workspace</p>
            <h1>
              A clear view.
              <br />
              Of everything.
            </h1>
            <p>Your catalogue and customer conversations, in one place.</p>
          </div>
          <span>
            <ShieldCheck size={17} /> Private administrator access
          </span>
        </div>
        <div className="admin-login-area">
          <Link className="text-link" href="/">
            <ArrowLeft size={17} /> Back to website
          </Link>
          <form className="admin-login-form admin-form" onSubmit={login}>
            <span className="admin-key-mark">
              <KeyRound size={26} />
            </span>
            <p className="eyebrow">Tirupati Coolers</p>
            <h2>Welcome back.</h2>
            <p>Enter your access key to open the admin workspace.</p>
            <label htmlFor="admin-access-key">Access key</label>
            <div className="admin-key-input">
              <input
                id="admin-access-key"
                name="key"
                type={visibleKey ? "text" : "password"}
                required
                maxLength={256}
                autoComplete="current-password"
                spellCheck={false}
                placeholder="Enter your private key"
              />
              <button
                type="button"
                aria-label={visibleKey ? "Hide access key" : "Show access key"}
                onClick={() => setVisibleKey((value) => !value)}
              >
                {visibleKey ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button className="button" disabled={busy || !configured}>
              {busy ? "Checking key…" : "Open workspace"}{" "}
              <ArrowUpRight size={17} />
            </button>
            <small>
              Keep your access key private. Your session expires after four
              hours.
            </small>
          </form>
        </div>
      </section>
    );

  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <Brand />
        <p className="eyebrow">Workspace</p>
        <nav aria-label="Admin navigation">
          <button
            className={tab === "products" ? "selected" : ""}
            onClick={() => {
              setTab("products");
              setError("");
            }}
          >
            <Package size={19} /> Products <span>{drafts.length}</span>
          </button>
          <button
            className={tab === "enquiries" ? "selected" : ""}
            onClick={() => {
              setTab("enquiries");
              setError("");
            }}
          >
            <Inbox size={19} /> Enquiries <span>0</span>
          </button>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank">
            View website <ArrowUpRight size={16} />
          </Link>
          <span>
            <ShieldCheck size={16} /> Admin
          </span>
          <button onClick={() => updateSession()} disabled={busy}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-page-heading">
          <div>
            <p className="eyebrow">Tirupati Coolers / Admin</p>
            <h1>
              {tab === "products" ? "Product catalogue" : "Customer enquiries"}
            </h1>
            <p>
              {tab === "products"
                ? "Organise the range. Keep every detail clear."
                : "A single inbox for enquiries sent through your website."}
            </p>
          </div>
          {tab === "products" && (
            <button className="button" onClick={() => openEditor()}>
              <Plus size={18} /> Add product
            </button>
          )}
        </header>
        <div className="admin-preview-note">
          <span className="admin-preview-dot" />
          <div>
            <strong>Interface preview</strong>
            <p>
              Database connection is paused. Product changes last until this
              page is refreshed. The public catalogue stays as it is, and no
              customer enquiries are being stored.
            </p>
          </div>
        </div>
        {notice && (
          <p className="admin-notice" role="status">
            <Check size={16} />
            {notice}
          </p>
        )}
        {error && !editing && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-stats">
          <article>
            <span>Product previews</span>
            <strong>{drafts.length.toString().padStart(2, "0")}</strong>
          </article>
          <article>
            <span>Drafts</span>
            <strong>
              {drafts
                .filter((item) => !item.published)
                .length.toString()
                .padStart(2, "0")}
            </strong>
          </article>
          <article>
            <span>Enquiries received</span>
            <strong>00</strong>
          </article>
        </div>
        {tab === "products" ? (
          <>
            <div className="admin-toolbar">
              <label className="admin-search">
                <Search size={18} />
                <span className="sr-only">Search products</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  placeholder="Search name, category or ID"
                />
              </label>
              <label>
                Status{" "}
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">All products</option>
                  <option value="draft">Draft</option>
                  <option value="published">Ready to publish</option>
                </select>
              </label>
            </div>
            <div className="admin-products">
              {filtered.map((item) => (
                <article className="admin-product-row" key={item.slug}>
                  <div className="admin-product-thumb">
                    <CoolerVisual
                      visualId={`admin-${item.slug}`}
                      tone={item.data.tone}
                      compact
                    />
                  </div>
                  <div>
                    <h2>{item.data.name}</h2>
                    <p>
                      {item.data.category} / {item.slug}
                    </p>
                  </div>
                  <span
                    className={`admin-status ${item.published ? "ready" : ""}`}
                  >
                    {item.published ? "Ready to publish" : "Draft"}
                  </span>
                  <div className="admin-row-actions">
                    <button
                      className="icon-button"
                      aria-label={`Edit ${item.data.name}`}
                      onClick={() => openEditor(item)}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`Remove ${item.data.name}`}
                      onClick={() => setRemoveTarget(item.slug)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  {removeTarget === item.slug && (
                    <div className="admin-remove-confirm">
                      <span>Remove this product preview?</span>
                      <button
                        onClick={() => {
                          setDrafts((items) =>
                            items.filter(
                              (product) => product.slug !== item.slug,
                            ),
                          );
                          setRemoveTarget(null);
                        }}
                      >
                        Remove
                      </button>
                      <button onClick={() => setRemoveTarget(null)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </article>
              ))}
              {!filtered.length && (
                <div className="admin-empty">
                  <Package size={30} />
                  <h2>No products found.</h2>
                  <p>Add a product or adjust your search.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="admin-inbox">
            <div className="admin-inbox-labels">
              <span>Customer</span>
              <span>Message</span>
              <span>Status</span>
              <span>Received</span>
            </div>
            <div className="admin-empty">
              <Inbox size={36} />
              <h2>A home for every enquiry.</h2>
              <p>
                Once the database is connected, contact form submissions will
                appear here with customer details, messages and new, contacted
                or closed status.
              </p>
              <span className="admin-status">
                Waiting for database connection
              </span>
            </div>
          </div>
        )}
      </div>
      <dialog
        ref={editor}
        className="admin-editor"
        aria-labelledby="product-editor-heading"
        onClose={() => {
          setEditing(null);
          setError("");
        }}
      >
        {editing && (
          <form
            className="admin-form"
            onSubmit={saveDraft}
            key={originalSlug || "new"}
          >
            <div className="admin-editor-heading">
              <div>
                <p className="eyebrow">Catalogue editor</p>
                <h2 id="product-editor-heading">
                  {originalSlug ? "Edit product" : "Add a product"}
                </h2>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close editor"
                onClick={() => editor.current?.close()}
              >
                <X size={21} />
              </button>
            </div>
            <p>
              Enter only verified details. Optional fields can be left empty.
            </p>
            <div className="admin-fields">
              {fields.map(([key, label, max, required]) => (
                <label key={key}>
                  {label}
                  {required && " *"}
                  <input
                    name={key}
                    defaultValue={editing.data[key] || ""}
                    required={required}
                    maxLength={max}
                    type={key === "imageUrl" ? "url" : "text"}
                    placeholder={key === "slug" ? "e.g. desert-80" : undefined}
                  />
                </label>
              ))}
            </div>
            <label>
              Description *
              <textarea
                name="summary"
                defaultValue={editing.data.summary}
                maxLength={1500}
                required
                rows={4}
              />
            </label>
            <label className="form-check">
              <input
                type="checkbox"
                name="published"
                defaultChecked={editing.published}
              />{" "}
              Mark as ready to publish
            </label>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="admin-editor-footer">
              <small>
                Preview only. This does not publish to the website yet.
              </small>
              <button className="button">
                Update preview <Check size={17} />
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
