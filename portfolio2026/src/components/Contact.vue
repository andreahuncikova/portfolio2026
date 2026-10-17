<script setup>
import { ref } from "vue"

const email = "a.huncikova@gmail.com"

// kľúč z web3forms.com (zadarmo, príde na e-mail) – bez neho sa správa iba otvorí v pošte návštevníka
const WEB3FORMS_KEY = "27d84198-816e-4f96-a2f1-7e7f70a4d163"

const from = ref("")
const subject = ref("Let's work together ♡")
const message = ref("")
const status = ref("idle") // idle | sending | sent | error
const copied = ref(false)

const openMailClient = () => {
  const params = new URLSearchParams({ subject: subject.value, body: message.value })
  window.location.href = `mailto:${email}?${params.toString().replace(/\+/g, "%20")}`
}

// správa odíde rovno na môj e-mail, odpovedať sa dá na adresu z poľa From
const send = async () => {
  if (!WEB3FORMS_KEY) return openMailClient()
  status.value = "sending"
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Portfolio: ${subject.value}`,
        from_name: "Portfolio contact",
        email: from.value,
        message: message.value
      })
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    status.value = "sent"
    message.value = ""
  } catch {
    status.value = "error"
  }
}

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(email)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    window.location.href = `mailto:${email}`
  }
}

// ostatné „aplikácie“ v docku vedľa okna
const apps = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/andreahuncikova",
    bg: "#0a66c2",
    // logo zo Simple Icons (iba „in“, štvorec robí samotná ikona)
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
  },
  {
    label: "GitHub",
    href: "https://github.com/andreahuncikova",
    bg: "#1f2328",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
  }
]
</script>

<template>
<!-- monitor na stole: plocha s otvoreným mailom a dockom vľavo s ďalšími kontaktmi -->
<section id="contact" class="monitor">
  <div class="monitor-frame">
    <div class="monitor-screen" data-focus>
      <div class="desktop">
        <nav class="dock" aria-label="Other contacts">
          <span class="dock-app dock-app-active" title="Mail" aria-hidden="true">
            <span class="dock-icon dock-icon-mail">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="m3 6.5 9 6.5 9-6.5" /></svg>
            </span>
          </span>
          <a
            v-for="app in apps"
            :key="app.label"
            :href="app.href"
            target="_blank"
            rel="noopener noreferrer"
            class="dock-app"
            :aria-label="app.label"
          >
            <span class="dock-tip">{{ app.label }}</span>
            <span class="dock-icon" :style="{ background: app.bg }">
              <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path :d="app.path" /></svg>
            </span>
          </a>
        </nav>

        <form class="mail" @submit.prevent="send">
          <div class="mail-bar" aria-hidden="true">
            <span class="mail-dot" style="background: #ff5f57"></span>
            <span class="mail-dot" style="background: #febc2e"></span>
            <span class="mail-dot" style="background: #28c840"></span>
            <span class="mail-bar-title">New message</span>
          </div>

          <div class="mail-fields">
            <p>
              <span class="mail-field-label">To</span>
              <span class="mail-to">Andrea Hunčíková &lt;{{ email }}&gt;</span>
              <button type="button" class="mail-copy" @click="copyEmail">
                {{ copied ? "copied ✓" : "copy" }}
              </button>
            </p>
            <label>
              <span class="mail-field-label">From</span>
              <input v-model="from" class="mail-input" type="email" required placeholder="your@email.com" />
            </label>
            <label>
              <span class="mail-field-label">Subject</span>
              <input v-model="subject" class="mail-input" type="text" />
            </label>
          </div>

          <div class="mail-body">
            <h2 class="mail-title">get in touch</h2>
            <p class="mail-text">
              Have a question or just want to say hi? Write me a few lines ♡
            </p>
            <textarea
              v-model="message"
              class="mail-textarea"
              rows="4"
              placeholder="Hi Andrea, …"
              aria-label="Message"
              required
            ></textarea>
            <div class="mail-actions">
              <p class="mail-status" aria-live="polite">
                <span v-if="status === 'sent'" class="mail-status-ok">Sent ✓ thank you, I'll get back to you soon ♡</span>
                <span v-else-if="status === 'error'" class="mail-status-err">
                  Something went wrong – write me directly at {{ email }}
                </span>
              </p>
              <button type="submit" class="mail-send" :disabled="status === 'sending'">
                {{ status === "sending" ? "Sending…" : "Send ➜" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="monitor-neck" aria-hidden="true"></div>
  <div class="monitor-feet" aria-hidden="true"></div>
</section>
</template>

<style scoped>
/* rozmery v px sveta izby (monitor ≈ 65 cm) */
.monitor {
  width: 1080px;
}

.monitor-frame {
  padding: 18px;
  border-radius: 10px;
  background: #121316;
  box-shadow: 14px 24px 36px rgba(20, 15, 10, 0.25);
}

.monitor-screen {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 600px;
  border-radius: 4px;
  background: linear-gradient(160deg, #f3d9d4, #e9e1f0 55%, #d8e6dc);
}

.desktop {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 28px;
  padding: 28px 40px 28px 16px;
}

.mail {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 18px 40px -14px rgba(40, 30, 30, 0.35);
}

.mail-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  background: #e8e5df;
}

.mail-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.mail-bar-title {
  flex: 1;
  margin-right: 52px;
  color: #6b665e;
  font: 600 13px/1 var(--font-text);
  text-align: center;
}

.mail-fields {
  padding: 2px 24px;
  border-bottom: 1px solid #e2ded6;
  background: #fbfaf7;
}

.mail-fields p,
.mail-fields label {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 9px 0;
  border-bottom: 1px solid #efece6;
  color: #2f2c28;
  font: 500 15px/1.2 var(--font-text);
}

.mail-fields label:last-child {
  border-bottom: 0;
}

.mail-field-label {
  flex: none;
  width: 76px;
  color: #9a948a;
}

.mail-to {
  flex: 1;
}

.mail-copy {
  padding: 4px 10px;
  border: 1px solid #e2ded6;
  border-radius: 999px;
  background: #fff;
  color: #526d4b;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.08em;
  cursor: pointer;
}

.mail-copy:hover {
  border-color: var(--ink-pink);
}

.mail-input {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}

.mail-input::placeholder {
  color: #c4beb4;
}

.mail-body {
  padding: 20px 24px;
  background: #fffdf9;
}

.mail-title {
  margin: 0 0 0.5rem;
  color: #c0283a;
  font: 700 3.2rem/1 var(--font-hand);
}

.mail-text {
  max-width: 40rem;
  margin: 0 0 1rem;
  color: #3d3a35;
  font: 400 1.02rem/1.6 var(--font-text);
}

.mail-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2ded6;
  border-radius: 8px;
  outline: 0;
  background: #fff;
  color: #2f2c28;
  font: 400 15px/1.5 var(--font-text);
  resize: none;
  transition: border-color 200ms ease;
}

.mail-textarea:focus {
  border-color: var(--ink-pink);
}

.mail-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
}

.mail-status {
  flex: 1;
  margin: 0;
  font: 500 14px/1.3 var(--font-text);
}

.mail-status-ok { color: #526d4b; }
.mail-status-err { color: #c0283a; }

.mail-send {
  padding: 10px 22px;
  border: 0;
  border-radius: 999px;
  background: #c0283a;
  color: #fff;
  font: 600 15px/1 var(--font-text);
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.mail-send:disabled {
  opacity: 0.6;
  cursor: wait;
}

.mail-send:not(:disabled):hover {
  box-shadow: 0 8px 16px -8px rgba(192, 40, 58, 0.7);
  transform: translateY(-2px);
}

/* dock ako na macu, prilepený k ľavému okraju (dole by ho prekryla nápoveda) */
.dock {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 10px 14px 12px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(10px);
}

.dock-app {
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.dock-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 13px;
  color: #fff;
  font: 700 22px/1 var(--font-text);
  box-shadow: 0 6px 12px -6px rgba(0, 0, 0, 0.4);
  transition: transform 200ms ease;
}

.dock-icon svg {
  width: 28px;
  height: 28px;
}

.dock-icon-mail {
  background: linear-gradient(180deg, #5ac8fa, #1a73e8);
}

a.dock-app:hover .dock-icon {
  transform: translateX(8px) scale(1.12);
}

.dock-app-active::after {
  content: "";
  position: absolute;
  top: 24px;
  left: -8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #3d3a35;
}

.dock-tip {
  position: absolute;
  top: 50%;
  left: calc(100% + 18px);
  z-index: 1;
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(40, 38, 35, 0.85);
  color: #fff;
  font: 500 12px/1 var(--font-text);
  white-space: nowrap;
  opacity: 0;
  transform: translate(-4px, -50%);
  transition: opacity 150ms ease, transform 150ms ease;
  pointer-events: none;
}

a.dock-app:hover .dock-tip {
  opacity: 1;
  transform: translate(0, -50%);
}

.monitor-neck {
  width: 90px;
  height: 110px;
  margin: 0 auto;
  background: linear-gradient(90deg, #2a2b2f, #4a4b50 50%, #2a2b2f);
}

.monitor-feet {
  width: 520px;
  height: 22px;
  margin: 0 auto;
  border-radius: 6px 6px 2px 2px;
  background: linear-gradient(180deg, #c8cacd, #8e9195);
}
</style>
