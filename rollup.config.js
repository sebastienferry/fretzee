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
        name: 'fretly',
        footer: 'if (typeof window !== "undefined" && window.fretly && !window.Fretly) { window.Fretly = window.fretly; }',
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
        name: 'FretlyMusic',
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
