import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
        defineField({
            name: 'clientName',
            title: 'Client Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role / Title',
            type: 'string',
            description: 'e.g. "YouTuber", "Brand Owner"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'platform',
            title: 'Platform',
            type: 'string',
            options: {
                list: [
                    { title: 'Upwork', value: 'Upwork' },
                    { title: 'Fiverr', value: 'Fiverr' },
                    { title: 'Direct', value: 'Direct' },
                    { title: 'Google', value: 'Google' },
                ],
            },
            initialValue: 'Upwork',
        }),
        defineField({
            name: 'rating',
            title: 'Rating',
            type: 'number',
            options: {
                list: [1, 2, 3, 4, 5],
            },
            initialValue: 5,
            validation: (Rule) => Rule.required().min(1).max(5),
        }),
        defineField({
            name: 'content',
            title: 'Review Content',
            type: 'text',
            validation: (Rule) => Rule.required().max(500),
        }),
        defineField({
            name: 'avatar',
            title: 'Client Avatar',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            initialValue: () => new Date().toISOString().split('T')[0],
        }),
    ],
    preview: {
        select: {
            title: 'clientName',
            subtitle: 'role',
            media: 'avatar',
        },
    },
})
