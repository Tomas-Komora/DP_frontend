import { extendType, objectType } from 'nexus';
import axios from 'axios';
import  z  from 'zod';

export const App = objectType({
    name: 'App',
    definition(t) {
        t.string('productId');
        t.nullable.string('productName');
        t.string('category');
        t.string('status');
        t.string('allowedModification');
        t.string('iconURL');
        t.string('description');
        t.nullable.string('activeTo');
        t.nullable.int('instanceId');
        t.string('productGroup');
    },
});

export const AppsContainer = objectType({
    name: 'AppsContainer',
    definition(t) {
        t.list.field('app', { type: 'App' });
    },
});

export const AppSlotItem = objectType({
    name: 'AppSlotItem',
    definition(t) {
        t.string('productId');
        t.nullable.string('productName');
        t.string('type');
        t.string('allowedModification');
        t.nullable.string('assignedAppId');
        t.field('apps', { type: 'AppsContainer' });
    },
});

export const AppSlot = objectType({
    name: 'AppSlot',
    definition(t) {
        t.list.field('appSlot', { type: 'AppSlotItem' });
    },
});


export const EntireAppSlots = z.object({
    appSlots: z.array(
        z.object({
            appSlot: z.array(
                z.object({
                    productId: z.string(),
                    productName: z.string().nullable(),
                    type: z.string(),
                    allowedModification: z.string(),
                    assignedAppId: z.string().nullable(),
                    apps: z.object({
                        app: z.array(
                            z.object({
                                productId: z.string(),
                                productName: z.string().nullable(),
                                category: z.string(),
                                status: z.string(),
                                allowedModification: z.string(),
                                iconURL: z.string(),
                                description: z.string(),
                                activeTo: z.string().nullable(), // Adjusted to use .nullable() for strings
                                instanceId: z.number().nullable(), // Adjusted to use .number() for integers
                                productGroup: z.string(),
                            }),
                        ),
                    }),
                }),
            ),
        }),
    ),
});

export const AppSlotsQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('appSlotsQuery', {
            type: 'AppSlot',
            resolve: async (_parent, _args, _context) => {
                try {
                    const response = await axios.get('http://localhost:8080/api/v1/appSlots');
                    const parsedResponse = EntireAppSlots.parse(response.data);
                    return parsedResponse.appSlots;
                } catch (error) {
                    console.error("Error fetching or parsing app slots:", error);
                    throw new Error("Failed to fetch app slots");
                }
            },
        });
    },
});