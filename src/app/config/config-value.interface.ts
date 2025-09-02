export interface ConfigValue {
  id?: number;
  m40: string;
  m20: string;
  ony: string;
  dmf: string;
  dmfLocation: string;
  madnessBoss: string;
  madnessWeek: string;
  resetTime: string;
}
export const createEmptyConfig = (): ConfigValue => ({
  resetTime: '',
  m40: '',
  m20: '',
  ony: '',
  dmf: '',
  dmfLocation: '',
  madnessBoss: '',
  madnessWeek: ''
});
