import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

const zhDemoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  sidebar: ['', 'foo', 'bar'],
})

// const zhAlgorithmNote = defineNoteConfig({
//   dir: 'algorithm',
//   link: '/notes/algorithm/',
//   sidebar: 'auto'
// })

// const zhJavaNote = defineNoteConfig({
//   dir: 'java',
//   link: '/notes/java/',
//   sidebar: 'auto'
// })

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [],
})

/* =================== locale: en-US ======================= */

// const enDemoNote = defineNoteConfig({
//   dir: 'demo',
//   link: '/demo',
//   sidebar: ['', 'foo', 'bar'],
// })

// export const enNotes = defineNotesConfig({
//   dir: 'en/notes',
//   link: '/en/',
//   notes: [enDemoNote],
// })

