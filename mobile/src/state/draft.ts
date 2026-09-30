import type { LancamentoInput } from "../domain/types";
export class DraftController {
  value: LancamentoInput | null = null;
  busy = false;
  private generation = 0;
  constructor(private save: (value: LancamentoInput) => Promise<unknown>) {}
  begin(value: LancamentoInput) {
    if (this.busy) return;
    this.generation++;
    this.value = value;
  }
  update(value: LancamentoInput) {
    if (!this.busy) this.value = value;
  }
  cancel() {
    if (this.busy) return;
    this.generation++;
    this.value = null;
  }
  async suggest(load: () => Promise<LancamentoInput>) {
    const g = ++this.generation;
    const value = await load();
    if (g !== this.generation) return false;
    this.value = value;
    return true;
  }
  async confirm() {
    if (this.busy || !this.value) return false;
    this.busy = true;
    try {
      await this.save(this.value);
      this.value = null;
      this.generation++;
      return true;
    } finally {
      this.busy = false;
    }
  }
}
