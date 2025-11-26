import { OAuth2Client } from "google-auth-library";
import environment from "../config/environment.js";

const { GOOGLE_CLIENT_ID } = environment;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const verifyGoogleIdToken = async (idToken) => {
          
            const ticket = await client.verifyIdToken({
                        idToken,
                        audience: GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            return payload;
}

export default verifyGoogleIdToken;