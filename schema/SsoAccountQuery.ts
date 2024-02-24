import { extendType, objectType } from 'nexus';
import axios from 'axios';
import  z  from 'zod';

export const SsoAccount = objectType({
    name: 'SsoAccount',
    definition(t) {
        t.string("otp");
        t.string("otpValidTo")
    },
})

export const ssoAccountSchema = z.object({
    ssoAccount: z.object({
        otp: z.string().optional(),
        otpValidTo: z.string().optional(),
    })
});

export const SsoAccountQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('ssoAccountQuery', {
            type: 'SsoAccount',
            resolve: async (_parent, _args, _context) => {
                try {
                    const response = await axios.get('http://localhost:8080/ssoAccount');
                    const parsedResponse = ssoAccountSchema.parse(response.data);
                    return parsedResponse.ssoAccount;
                } catch (error) {
                    console.error("Error fetching or parsing app slots:", error);
                    throw new Error("Failed to fetch app slots");
                }
            },
        });
    },
});
