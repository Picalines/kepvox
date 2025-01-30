import fs from 'node:fs'
import path from 'node:path'

// Copies the index.d.ts file built in the @repo/synth package
// to the public folder, so the client app can give it in the monaco editor

const synthPackageURL = new URL(import.meta.resolve('@repo/synth'))
const synthPackageDir = path.dirname(synthPackageURL.pathname)
const synthPackageDtsPath = path.resolve(synthPackageDir, 'index.d.ts')

const dtsCopyPath = path.resolve('./public/synth.d.ts.txt')

fs.rmSync(dtsCopyPath, { force: true })

fs.cpSync(synthPackageDtsPath, dtsCopyPath)
