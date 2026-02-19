import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'YouTube', value: 'YouTube' },
                    { title: 'Instagram', value: 'Instagram' },
                    { title: 'TikTok', value: 'TikTok' },
                    { title: 'Reels', value: 'Reels' },
                ],
            },
            initialValue: 'YouTube',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'videoUrl',
            title: 'Target URL (YouTube/Insta Link)',
            type: 'url',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false,
            description: 'Highlight this project on the home page?',
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0,
            description: 'Higher numbers appear first (optional)',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            category: 'category',
            media: 'thumbnail',
        },
        prepare(selection) {
            const { category } = selection
            return { ...selection, subtitle: category }
        },
    },
})
