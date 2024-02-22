import { extendType, objectType } from 'nexus';
import axios from 'axios';
import { z } from 'zod';

const priceLevelSchema = z.object({
    priceList: z.string(),
    priceWithVAT: z.number(),
    isEnabled: z.boolean(),
    isActive: z.boolean().optional(), // Optional as it's not present in all objects
});

// Adjusting for the flat structure of allowedModification, treating it as a string key rather than nested
const serviceSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    serviceGroup: z.string(),
    status: z.string(),
    activateOn: z.string().optional(),
    listPriority: z.number(),
    instanceId: z.number(),
    "allowedModification.v2": z.string(), // Adjusted to match the response structure
    type: z.string().optional(),
    priceWithVAT: z.number().optional(),
    listPriceWithVAT: z.number().optional(),
    period: z.string().optional(),
    protectionPeriodEndDate: z.string().optional(),
    validTo: z.string().optional(),
    isMultiInstance: z.boolean().optional(),
    activationCode: z.string().optional(),
    priceLevels: z.array(priceLevelSchema).optional(),
});

// Updated to ensure optional fields are correctly handled
const chargeUnitSchema = z.object({
    chargeUnit: z.string(),
    chargeQuantity: z.number().optional(),
    chargeValue: z.number().optional(), // Made optional to match the structure where it might not be present
    chargeValueWithVAT: z.number().optional(), // Made optional to accommodate the diverse structure of charge units
});

const usageSummarySchema = z.object({
    priceAfterAppliedFU: z.number(),
    priceAfterAppliedFUWithVAT: z.number(),
    accummulatedCharges: z.array(chargeUnitSchema),
});

const servicesAndUsageSchema = z.object({
    service: z.array(serviceSchema),
    usageAt: z.string(),
    usageSummary: usageSummarySchema,
    lastRoamingZone: z.number(),
});

const responseSchema = z.object({
    servicesAndUsage: servicesAndUsageSchema,
});
export const PriceLevel = objectType({
    name: 'PriceLevel',
    definition(t) {
        t.string('priceList');
        t.float('priceWithVAT');
        t.boolean('isEnabled');
        t.nullable.boolean('isActive');
    },
});

export const Service = objectType({
    name: 'Service',
    definition(t) {
        t.string('productId');
        t.string('productName');
        t.string('serviceGroup');
        t.string('status');
        t.string('activateOn');
        t.int('listPriority');
        t.int('instanceId');
        t.field('allowedModification', {
            type: 'AllowedModification'
        });
        t.nullable.string('type');
        t.nullable.float('priceWithVAT');
        t.nullable.float('listPriceWithVAT');
        t.nullable.string('period');
        t.nullable.string('protectionPeriodEndDate');
        t.nullable.string('validTo');
        t.nullable.boolean('isMultiInstance');
        t.nullable.string('activationCode');
        t.nullable.list.field('priceLevels', {
            type: 'PriceLevel'
        });
    },
});

export const ChargeUnit = objectType({
    name: 'ChargeUnit',
    definition(t) {
        t.string('chargeUnit');
        t.nullable.int('chargeQuantity');
        t.float('chargeValue');
        t.float('chargeValueWithVAT');
    },
});

export const UsageSummary = objectType({
    name: 'UsageSummary',
    definition(t) {
        t.float('priceAfterAppliedFU');
        t.float('priceAfterAppliedFUWithVAT');
        t.list.field('accummulatedCharges', {
            type: 'ChargeUnit'
        });
    },
});
export const AllowedModification = objectType({
    name: 'AllowedModification',
    definition(t) {
        t.string('v2');
    },
});

export const ServicesAndUsage = objectType({
    name: 'ServicesAndUsage',
    definition(t) {
        t.list.field('service', {
            type: 'Service',
        });
        t.string('usageAt');
        t.field('usageSummary', {
            type: 'UsageSummary',
        });
        t.int('lastRoamingZone');
    },
});

export const ServiceAndUsageQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('servicesAndUsageQuery', {
            type: 'ServicesAndUsage',
            resolve: async () => {
                try {
                    const response = await axios.get('http://localhost:8080/serviceAndUsage');
                    console.log(JSON.stringify(response.data));
                    const parsedResponse = responseSchema.parse(response.data);
                    return parsedResponse.servicesAndUsage;
                } catch (error) {
                    console.error("Error fetching or parsing service and usage data:", error);
                    throw new Error("Failed to fetch service and usage data");
                }
            },
        });
    },
});