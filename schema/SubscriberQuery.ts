import { extendType, objectType } from 'nexus';
import axios from 'axios';
import  z from 'zod';

const EmailSchema = z.object({
    einvoiceEmail: z.string(),
    bpemail: z.string(),
    zekVerificationStatus: z.enum(["VERIFIED_INTERNALLY"]),
});

const TariffSchema = z.object({
    tariffId: z.string(),
    tariffName: z.string(),
    tariffType: z.number(),
    tariffTypeEnum: z.enum(["POSTPAID"]),
    status: z.string(),
    includedSubscriptionSlots: z.number(),
});

const SettingsSchema = z.object({
    hasDigitalBox: z.boolean(),
    hasInvoicePaymentCharge: z.boolean(),
    hasEbillBillMediaType: z.boolean(),
    hasMktForMobappDisabled: z.boolean(),
});

export const SubscriberSchema = z.object({
    scratchDay: z.string(),
    eligibleForApp: z.boolean(),
    subscriberType: z.enum(["postpaid"]),
    subscriberId: z.number(),
    msisdn: z.number(),
    assetLastUpdatedAt: z.string(),
    tariffs: z.array(TariffSchema),
    activationDate: z.string(),
    status: z.string(),
    statusDate: z.string(),
    statusReason: z.string(),
    bacuRefNo: z.number(),
    baname: z.string(),
    bpfirstName: z.string(),
    bpcuRefNo: z.number(),
    businessSegment: z.boolean(),
    selfServiceManagement: z.boolean(),
    startOfBC: z.string(),
    endOfBC: z.string(),
    daysTillEndOfBC: z.number(),
    billCycleId: z.string(),
    changedTariffInCurrentBc: z.boolean(),
    billMediaType: z.enum(["EBill"]),
    email: EmailSchema,
    settings: SettingsSchema,
    hasMoreSubscribers: z.enum(["Yes", "No"]),
    hasMoreBillingArrangements: z.enum(["Yes", "No"]),
});

export const EntireResponseSchemaSubscriber = z.object({
    subscriber: SubscriberSchema,
});

export const Email = objectType({
    name: 'Email',
    definition(t) {
        t.string('einvoiceEmail');
        t.string('bpemail');
        t.string('zekVerificationStatus');
    },
});

export const Tariff = objectType({
    name: 'Tariff',
    definition(t) {
        t.string('tariffId');
        t.string('tariffName');
        t.int('tariffType');
        t.string('tariffTypeEnum');
        t.string('status');
        t.int('includedSubscriptionSlots');
    },
});

export const Settings = objectType({
    name: 'Settings',
    definition(t) {
        t.boolean('hasDigitalBox');
        t.boolean('hasInvoicePaymentCharge');
        t.boolean('hasEbillBillMediaType');
        t.boolean('hasMktForMobappDisabled');
    },
});

export const Subscriber = objectType({
    name: 'Subscriber',
    definition(t) {
        t.string('scratchDay');
        t.boolean('eligibleForApp');
        t.string('subscriberType');
        t.int('subscriberId');
        t.int('msisdn');
        t.string('assetLastUpdatedAt');
        t.list.field('tariffs', { type: 'Tariff' });
        t.string('activationDate');
        t.string('status');
        t.string('statusDate');
        t.string('statusReason');
        t.int('bacuRefNo');
        t.string('baname');
        t.string('bpfirstName');
        t.int('bpcuRefNo');
        t.boolean('businessSegment');
        t.boolean('selfServiceManagement');
        t.string('startOfBC');
        t.string('endOfBC');
        t.int('daysTillEndOfBC');
        t.string('billCycleId');
        t.boolean('changedTariffInCurrentBc');
        t.string('billMediaType');
        t.field('email', { type: 'Email' });
        t.field('settings', { type: 'Settings' });
        t.string('hasMoreSubscribers');
        t.string('hasMoreBillingArrangements');
    },
});

export const EntireResponse = objectType({
    name: 'EntireResponse',
    definition(t) {
        t.field('subscriber', { type: "Subscriber" });
    },
});

export const SubscriberQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('subscriberQuery', {
            type: 'EntireResponse',
            resolve: async (_parent, _args, _context) => {
                try {
                    const response = await axios.get('http://localhost:8080/api/v1/subscriber');
                    const parsedResponse = EntireResponseSchemaSubscriber.parse(response.data);
                    // Adjusted to match the expected shape.
                    return { subscriber: parsedResponse.subscriber };
                } catch (error) {
                    console.error("Error fetching or parsing subscriber data:", error);
                    throw new Error("Failed to fetch subscriber data");
                }
            },
        });
    },
});