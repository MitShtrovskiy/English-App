// src/utils/gradients.ts

const gradients = [
  'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
  'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
  'linear-gradient(135deg, #FDCB82 0%, #F9A1BC 100%)',
  'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)',
  'linear-gradient(135deg, #C2FFD8 0%, #465EFB 100%)',
  'linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 100%)',
  'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
  'linear-gradient(135deg, #A1FFCE 0%, #FAFFD1 100%)',
  'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
  'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
  // можно добавить ещё
]

export function generateGradient(index: number) {
  return gradients[index % gradients.length]
}