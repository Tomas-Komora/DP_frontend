import {extendType, objectType} from 'nexus';
import axios from 'axios';
import z from 'zod';

const priceLevelSchema = z.object({
    priceList: z.string(),
    priceWithVAT: z.number(),
    isEnabled: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

const serviceSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    serviceGroup: z.string(),
    status: z.string(),
    activateOn: z.string().optional(),
    listPriority: z.number(),
    instanceId: z.number(),
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

const chargeUnitSchema = z.object({
    chargeUnit: z.string(),
    chargeQuantity: z.number().optional(),
    chargeValue: z.number().optional(),
    chargeValueWithVAT: z.number().optional(),
});

const usageSummarySchema = z.object({
    priceAfterAppliedFU: z.number(),
    priceAfterAppliedFUWithVAT: z.number(),
    accummulatedCharges: z.array(chargeUnitSchema),
});

export const servicesAndUsageSchema = z.object({
    service: z.array(serviceSchema),
    usageAt: z.string(),
    usageSummary: usageSummarySchema,
    lastRoamingZone: z.number(),
});

export const servicesAndUsage = z.object({
    servicesAndUsage: servicesAndUsageSchema,
});
export const PriceLevel = objectType({
    name: 'PriceLevel',
    definition(t) {
        t.string('priceList');
        t.float('priceWithVAT');
        t.nullable.boolean('isEnabled');
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
        t.nullable.string('activateOn');
        t.int('listPriority');
        t.int('instanceId');
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
                    const response = await axios.get('http://localhost:8080/api/v1/servicesAndUsages');
                    const parsedResponse = servicesAndUsage.parse(response.data);
                    return parsedResponse.servicesAndUsage;
                } catch (error) {
                    console.error("Error fetching or parsing service and usage data:", error);
                    throw new Error("Failed to fetch service and usage data");
                }
            },
        });
    },
});