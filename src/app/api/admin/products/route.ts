import { MongoServerError } from "mongodb";
import { isAdmin } from "@/lib/admin-auth";
import { field, productInput, record } from "@/lib/admin-validation";
import {
  listAdminProducts,
  removeProduct,
  saveProduct,
} from "@/lib/product-repository";
import {
  formFailure,
  privateReply,
  readFormJson,
  RequestError,
  throttle,
} from "@/lib/request-guards";

export const dynamic = "force-dynamic";

async function authorize() {
  if (!(await isAdmin()))
    throw new RequestError(401, "Your admin session has expired.");
}

export async function GET() {
  try {
    await authorize();
    return privateReply({ products: await listAdminProducts() });
  } catch (error) {
    return formFailure(error);
  }
}

export async function PUT(request: Request) {
  try {
    await authorize();
    throttle("admin-products", 120);
    const input = record(await readFormJson(request));
    const originalSlug = field(input, "originalSlug", 80, false) || undefined;
    const product = productInput(input.product);
    if (!(await saveProduct(originalSlug, product.data, product.published)))
      throw new RequestError(404, "The original product no longer exists.");
    return privateReply({ product });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000)
      return privateReply({ error: "That product ID is already in use." }, 409);
    return formFailure(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await authorize();
    throttle("admin-products", 120);
    const input = record(await readFormJson(request));
    if (!(await removeProduct(field(input, "slug", 80))))
      throw new RequestError(404, "Product not found.");
    return privateReply({ removed: true });
  } catch (error) {
    return formFailure(error);
  }
}
