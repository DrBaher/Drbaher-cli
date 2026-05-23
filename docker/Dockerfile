# contract-ops suite — all nine CLIs in one image (a CLI toolbox, not a server).
#
#   docker run --rm -v "$PWD:/work" -w /work ghcr.io/drbaher/contract-ops extract contract.pdf --json
#   docker run --rm -it -v "$PWD:/work" -w /work ghcr.io/drbaher/contract-ops bash   # interactive
#
# Python (pipx): extract-cli, template-vault-cli, nda-review-cli, contract-vault, contract-lint
# Node (npm):    @drbaher/draft-cli, compare-cli, docx2pdf-cli, @drbaher/sign-cli
# docx2pdf needs a PDF backend → LibreOffice (headless). sign uses node:sqlite → Node 22+.
FROM node:22-bookworm-slim

# PDF backend + base fonts for docx2pdf; git for the vault CLIs (they commit); python/pipx.
RUN apt-get update && apt-get install -y --no-install-recommends \
      libreoffice-writer fonts-liberation python3 pipx git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# A default git identity so the git-backed vault CLIs can commit out of the box.
ENV GIT_AUTHOR_NAME=contract-ops GIT_AUTHOR_EMAIL=contract-ops@local \
    GIT_COMMITTER_NAME=contract-ops GIT_COMMITTER_EMAIL=contract-ops@local

# Node CLIs.
RUN npm i -g @drbaher/draft-cli compare-cli docx2pdf-cli @drbaher/sign-cli \
  && npm cache clean --force

# Python CLIs (pipx installs onto PATH via /usr/local/bin).
ENV PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin
RUN pipx install extract-cli \
  && pipx install template-vault-cli \
  && pipx install nda-review-cli \
  && pipx install contract-vault \
  && pipx install contract-lint

WORKDIR /work
# No ENTRYPOINT: `docker run <image> <cli> [args]` runs that CLI; bare run drops to a shell.
CMD ["bash"]
