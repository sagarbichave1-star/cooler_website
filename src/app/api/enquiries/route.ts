import { enquiryInput, field, record } from "@/lib/admin-validation";
import {
  formFailure,
  privateReply,
  readFormJson,
  throttle,
} from "@/lib/request-guards";

export async function POST(request: Request) {
  try {
    // This route intentionally validates but does not persist enquiries until
    // a real, consent-aware CRM adapter is approved and connected.
    throttle("contact-preview", 60);
    const input = record(await readFormJson(request));
    if (field(input, "website", 200, false))
      return privateReply({ accepted: true });
    enquiryInput(input);
    // Deliberately do not store contact details or report success before a real
    // persistence adapter is connected. The visitor retains the filled form.
    return privateReply(
      {
        error:
          "Online enquiries are not available yet. Please send your message on WhatsApp instead.",
      },
      503,
    );
  } catch (error) {
    return formFailure(error);
  }
}
