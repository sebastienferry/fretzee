import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'fretzee',
        footer: 'if (typeof window !== "undefined") { if (!window.Fretzee) window.Fretzee = window.fretzee; if (!window.fretzee) window.fretzee = window.Fretzee; if (!window.Fretly) window.Fretly = window.Fretzee; if (!window.fretly) window.fretly = window.Fretzee; }',
        sourcemap: true,
        globals: {}
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        rootDir: 'src',
        exclude: ['**/*.test.ts']
      })
    ]
  },
  {
    input: 'src/music/index.ts',
    output: [
      {
        file: 'dist/music.esm.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/music.umd.js',
        format: 'umd',
        name: 'FretzeeMusic',
        footer: 'if (typeof window !== "undefined" && !window.FretlyMusic) { window.FretlyMusic = window.FretzeeMusic; }',
        sourcemap: true,
        globals: {}
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/music',
        rootDir: 'src',
        exclude: ['**/*.test.ts']
      })
    ]
  }
];
