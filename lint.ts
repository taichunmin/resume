import fsPromises from 'fs/promises'
import iso3166 from 'iso-3166-1'
import JSON5 from 'json5'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import * as z from 'zod'

const countryCodes = iso3166.all().map(c => c.alpha2)

const ZodResumeLocation = z.object({
  address: z.string().trim().min(1).optional(),
  postalCode: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  countryCode: z.preprocess((val: any) => {
    return typeof val === "string" ? val.trim().toUpperCase() : val
  }, z.enum(countryCodes).optional()),
  region: z.string().trim().min(1).optional(),
})

const ZodResumeProfile = z.object({
  network: z.string().trim().min(1).optional(),
  username: z.string().trim().min(1).optional(),
  url: z.url().trim().optional(),
})

const ZodResumeBasics = z.object({
  name: z.string().trim().min(1).optional(),
  label: z.string().trim().min(1).optional(),
  image: z.url().trim().optional(),
  email: z.email().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
  birthday: z.iso.date().optional(),
  url: z.url().trim().optional(),
  summary: z.string().trim().min(1).optional(),
  location: ZodResumeLocation.optional(),
  profiles: z.array(ZodResumeProfile).optional(),
})

const ZodResumeWork = z.object({
  name: z.string().trim().min(1).optional(),
  position: z.string().trim().min(1).optional(),
  url: z.url().trim().optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  summary: z.string().trim().min(1).optional(),
  highlights: z.array(z.string().trim().min(1)).optional(),
})

const ZodResumeVolunteer = z.object({
  organization: z.string().trim().min(1).optional(),
  position: z.string().trim().min(1).optional(),
  url: z.url().trim().optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  summary: z.string().trim().min(1).optional(),
  highlights: z.array(z.string().trim().min(1)).optional(),
})

const ZodResumeEducation = z.object({
  institution: z.string().trim().min(1).optional(),
  url: z.url().trim().optional(),
  area: z.string().trim().min(1).optional(),
  studyType: z.string().trim().min(1).optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  score: z.string().trim().min(1).optional(),
  courses: z.array(z.string().trim().min(1)).optional(),
})

const ZodResumeAward = z.object({
  title: z.string().trim().min(1).optional(),
  date: z.iso.date().optional(),
  awarder: z.string().trim().min(1).optional(),
  summary: z.string().trim().min(1).optional(),
})

const ZodResumeCertificate = z.object({
  name: z.string().trim().min(1).optional(),
  date: z.iso.date().optional(),
  issuer: z.string().trim().min(1).optional(),
  url: z.url().trim().optional(),
})

const ZodResumePublication = z.object({
  name: z.string().trim().min(1).optional(),
  publisher: z.string().trim().min(1).optional(),
  releaseDate: z.iso.date().optional(),
  url: z.url().trim().optional(),
  summary: z.string().trim().min(1).optional(),
})

const ZodResumeSkill = z.object({
  name: z.string().trim().min(1).optional(),
  level: z.string().trim().min(1).optional(),
  keywords: z.array(z.string().trim().min(1)).optional(),
})

const ZodResumeLanguage = z.object({
  language: z.string().trim().min(1).optional(),
  fluency: z.string().trim().min(1).optional(),
})

const ZodResumeInterest = z.object({
  name: z.string().trim().min(1).optional(),
  keywords: z.array(z.string().trim().min(1)).optional(),
})

const ZodResumeReference = z.object({
  name: z.string().trim().min(1).optional(),
  reference: z.string().trim().min(1).optional(),
})

const ZodResumeProject = z.object({
  name: z.string().trim().min(1).optional(),
  url: z.url().trim().optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  description: z.string().trim().min(1).optional(),
  highlights: z.array(z.string().trim().min(1)).optional(),
})

const ZodResumeMeta = z.object({
  theme: z.string().trim().min(1).optional(),
  canonical: z.url().trim().optional(),
  version: z.string().trim().min(1).optional(),
  lastModified: z.iso.datetime({ local: true }).optional(),
})

const ZodResume = z.object({
  // resume.json v1.0.0
  basics: ZodResumeBasics.optional(),
  work: z.array(ZodResumeWork).optional(),
  volunteer: z.array(ZodResumeVolunteer).optional(),
  education: z.array(ZodResumeEducation).optional(),
  awards: z.array(ZodResumeAward).optional(),
  certificates: z.array(ZodResumeCertificate).optional(),
  publications: z.array(ZodResumePublication).optional(),
  skills: z.array(ZodResumeSkill).optional(),
  languages: z.array(ZodResumeLanguage).optional(),
  interests: z.array(ZodResumeInterest).optional(),
  references: z.array(ZodResumeReference).optional(),
  projects: z.array(ZodResumeProject).optional(),

  // extra
  $schema: z.url().optional(),
  meta: ZodResumeMeta.optional(),
})

async function main () {
  for (let i = 2; i < process.argv.length; i++) {
    const filepath = path.resolve(process.cwd(), process.argv[i])
    try {
      let resume: any = await fsPromises.readFile(filepath, { encoding: 'utf8' })
      resume = JSON5.parse(resume)
      resume = ZodResume.parse(resume)
      await fsPromises.writeFile(filepath, JSON.stringify(resume, null, 2) + '\n', { encoding: 'utf8' })
    } catch (err) {
      console.error(`Resume file: ${filepath}\n${err.message}`)
      console.error(err)
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error(err)
    process.exit(1)
  })
}