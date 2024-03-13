import { enumType, extendType, objectType } from 'nexus';
import axios from 'axios';
import  z  from 'zod';

export const CommunicationChannelSchema = z.enum(["email", "sms", "voice", "web"]);

export const ApprovalSchema = z.object({
    name: z.string(),
    approved: z.boolean(),
    communicationChannels: z.object({
        communicationChannel: z.array(CommunicationChannelSchema),
    }).optional(),
    validFrom: z.string().optional(),
    isChannelSettable: z.boolean().optional(),
    isApprovalSettable: z.boolean().optional(),
    approvalCheckboxName: z.string().optional(),
});

export const EntireApprovals = z.object({
    approvals: z.object({
        approval: z.array(ApprovalSchema),
    }),
});


export const CommunicationChannel = enumType({
    name: 'CommunicationChannel',
    members: ['email', 'sms', 'voice', 'web'],
});

export const CommunicationChannels = objectType({
    name: 'CommunicationChannels',
    definition(t) {
        t.nonNull.list.field('communicationChannel', { type: 'CommunicationChannel' });
    },
});

export const Approval = objectType({
    name: 'Approval',
    definition(t) {
        t.nonNull.string('name');
        t.nonNull.boolean('approved');
        t.nullable.field('communicationChannels', { type: ('CommunicationChannels') });
        t.nullable.string('validFrom');
        t.nullable.boolean('isChannelSettable');
        t.nullable.boolean('isApprovalSettable');
        t.nullable.string('approvalCheckboxName')
    },
});

export const Approvals = objectType({
    name: 'Approvals',
    definition(t) {
        t.nonNull.list.field('approval', { type: 'Approval' });
    },
});

export const ApprovalsQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('approvalsQuery', {
            type: 'Approvals',
            resolve: async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/v1/approvals');
                    // Adjust the path to match the structure of your data
                    const approvals = response.data.approvals.approval.map(approval => {
                        // Assuming communicationChannels can be directly used or set as an empty object if undefined
                        const communicationChannels = approval.communicationChannels
                            ? { communicationChannel: approval.communicationChannels.communicationChannel || [] }
                            : { communicationChannel: [] };

                        return {
                            ...approval,
                            communicationChannels,
                        };
                    });

                    return { approval: approvals };
                } catch (error) {
                    console.error(error);
                    throw new Error('Failed to fetch approvals');
                }
            },
        });
    },
});