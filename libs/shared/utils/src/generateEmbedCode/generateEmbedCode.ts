type Props = {
  origin: string;
  language: string;
  name: string;
};

export function generateEmbedCode({ origin, language, name }: Props) {
  const src = `${origin}/${language}/${name}?isEmbedded=true`;

  return `<script src="${origin}/api/embed"></script>
    <div class="mas-iframe-container" style="width: 100%; overflow: hidden; padding-top: 66.66%; position: relative;">
      <iframe
        class="mas-iframe"
        style="width: 100%; height: 100%; left: 0; position: absolute; top: 0; border: 0;"
        src="${src}"
        loading="lazy"
      ></iframe>
    </div>`;
}
