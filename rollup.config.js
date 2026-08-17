import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

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
      }),
      terser()
    ]
  }
];

