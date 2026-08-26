source "https://rubygems.org"

# ── Why not `github-pages`? ──────────────────────────────────────────────────
# GitHub Pages' classic build ignores this Gemfile entirely and builds
# server-side with its own pinned set (Jekyll 3.10, Ruby 3.3) — so this file
# exists only for local preview. The `github-pages` gem itself cannot install
# on Ruby >= 4.0 (its commonmarker dependency caps Ruby at < 4.0), so we mirror
# the parts of the Pages environment this site actually uses instead:
gem "jekyll", "~> 3.10.0"          # same Jekyll line Pages runs
gem "kramdown-parser-gfm"          # GFM markdown, as on Pages

# Stdlib gems that left Ruby's default set (3.4+ / 4.0) but are still required
# by Jekyll 3.x and its dependencies.
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"

gem "webrick", "~> 1.8"            # jekyll serve on Ruby 3+
