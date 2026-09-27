export type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "entries";
      items: {
        title: string;
        body: string;
        note?: { label: string; text: string };
      }[];
    }
  | { type: "diagram"; label: string; art: string; caption?: string }
  | {
      type: "image";
      alt: string; // describe el diagrama para lectores de pantalla
      hint?: string; // ayuda para ti: qué dibujar y dónde guardarlo
      src?: string; // ej. "/images/prism-store/payment-flow.png"
      srcDark?: string; // opcional: versión para tema oscuro
      aspect?: string; // proporción, ej. "16 / 9"
      caption?: string;
    }
  | { type: "code"; label: string; code: string };

export type CaseSection = { id: string; title: string; blocks: Block[] };

export type CaseStudy = {
  summary: string;
  facts: { label: string; value: string }[];
  sections: CaseSection[];
};
