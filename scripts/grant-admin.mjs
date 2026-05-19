#!/usr/bin/env node
/**
 * Grant the `role: "admin"` custom claim to a Firebase user.
 *
 * Usage:
 *   node scripts/grant-admin.mjs <email>
 *   node scripts/grant-admin.mjs marlvingore.edu@gmail.com
 *
 * Setup (one-time):
 *   1. Firebase Console → Project settings → Service accounts → "Generate new private key"
 *   2. Save the file as `service-account.json` in the project root (gitignored)
 *   3. Install firebase-admin if not already:  npm i -D firebase-admin
 *   4. Run this script.
 *
 * After running:
 *   - Sign out of SoarTV in your browser, sign back in (refresh ID token)
 *   - Visit /admin — access granted.
 *
 * To revoke admin later:
 *   node scripts/grant-admin.mjs <email> --revoke
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const __dirname    = dirname(fileURLToPath(import.meta.url))
const projectRoot  = join(__dirname, '..')
const serviceAcct  = join(projectRoot, 'service-account.json')

// ─── Parse args ───────────────────────────────────────────────────────────────

const args   = process.argv.slice(2)
const email  = args.find(a => !a.startsWith('--'))
const revoke = args.includes('--revoke')

if (!email) {
  console.error('Usage: node scripts/grant-admin.mjs <email> [--revoke]')
  process.exit(1)
}

if (!existsSync(serviceAcct)) {
  console.error(`\n❌ Service account key not found at:\n   ${serviceAcct}\n`)
  console.error('Get one from:')
  console.error('  Firebase Console → Project settings → Service accounts → Generate new private key')
  console.error(`Save it as ./service-account.json in the project root.\n`)
  process.exit(1)
}

// ─── Init Admin SDK ───────────────────────────────────────────────────────────

const credentials = JSON.parse(readFileSync(serviceAcct, 'utf-8'))
initializeApp({ credential: cert(credentials) })

// ─── Grant / revoke ───────────────────────────────────────────────────────────

try {
  const user      = await getAuth().getUserByEmail(email)
  const newClaims = { ...(user.customClaims ?? {}), role: revoke ? null : 'admin' }

  await getAuth().setCustomUserClaims(user.uid, newClaims)

  console.log(`\n✅ ${revoke ? 'Revoked' : 'Granted'} admin role for ${email}`)
  console.log(`   uid: ${user.uid}`)
  console.log(`   claims: ${JSON.stringify(newClaims)}\n`)
  console.log('Next steps:')
  console.log('  1. Sign out of SoarTV in your browser')
  console.log('  2. Sign back in (refreshes the ID token)')
  console.log(revoke ? '  3. /admin will deny access\n' : '  3. Visit /admin\n')
} catch (err) {
  if (err.code === 'auth/user-not-found') {
    console.error(`\n❌ No Firebase user with email: ${email}`)
    console.error('Create the account first by signing up at http://localhost:3000\n')
  } else {
    console.error('\n❌ Failed to update claims:', err.message ?? err)
  }
  process.exit(1)
}
