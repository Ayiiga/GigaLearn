# Push GigaLearn to GitHub (local)

## Token requirements

The GitHub PAT must allow **Contents: Read and write** on `Ayiiga/GigaLearn`.

- **Fine-grained token:** Repository access → `Ayiiga/GigaLearn` → Permissions → **Contents: Read and write**
- **Classic token:** scope `repo`

If push fails with `403` or `Resource not accessible by personal access token`, regenerate the token with Contents write.

## Push from GitLab clone

```bash
git clone https://gitlab.com/ayiiga3-group/vibepay.git
cd vibepay
git checkout main
export GITHUB_TOKEN=your_pat_with_contents_write
./scripts/push-github.sh
```

Target: **https://github.com/Ayiiga/GigaLearn**

## After push

1. GitHub → **Settings → Secrets and variables → Actions**
2. Add secrets from `gigalearn/docs/DEPLOY_VERCEL.md` or `DEPLOY_GITHUB_CLOUDFLARE.md`
3. Vercel (recommended): connect repo, root directory `gigalearn`
