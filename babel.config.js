module.exports = function (api) {
  api.cache(true);
  
  const isProd = process.env.NODE_ENV === 'production';

  const plugins = [];

  // تعمية النصوص لحماية الروابط والمفاتيح
  function obfuscateStringsPlugin({ types: t }) {
    return {
      name: 'obfuscate-strings',
      visitor: {
        StringLiteral(path, state) {
          const filename = state.file.opts.filename || '';
          if (!/api\.ts|LoginScreen\.tsx/.test(filename)) {
            return;
          }
          const value = path.node.value;
          if (!value || value.length < 3) return;
          if (path.parent) {
            if (path.parent.type === 'ImportDeclaration' || 
                path.parent.type === 'ExportNamedDeclaration' || 
                path.parent.type === 'JSXAttribute') {
              return;
            }
            if (path.parent.type === 'CallExpression' && 
                path.parent.callee && 
                path.parent.callee.name === 'require') {
              return;
            }
          }

          const key = 42;
          const encoded = Array.from(value).map(c => c.charCodeAt(0) ^ key);
          const arrayExpr = t.arrayExpression(encoded.map(num => t.numericLiteral(num)));
          
          const mapCallback = t.functionExpression(
            null,
            [t.identifier('c')],
            t.blockStatement([
              t.returnStatement(
                t.callExpression(
                  t.memberExpression(t.identifier('String'), t.identifier('fromCharCode')),
                  [t.binaryExpression('^', t.identifier('c'), t.numericLiteral(key))]
                )
              )
            ])
          );

          const mapCall = t.callExpression(
            t.memberExpression(arrayExpr, t.identifier('map')),
            [mapCallback]
          );

          const joinCall = t.callExpression(
            t.memberExpression(mapCall, t.identifier('join')),
            [t.stringLiteral('')]
          );

          path.replaceWith(joinCall);
          path.skip();
        }
      }
    };
  }
  
  if (isProd) {
    plugins.push(require.resolve('babel-plugin-transform-remove-console'));
    plugins.push(obfuscateStringsPlugin);
  }

  // Reanimated plugin must be the absolute last plugin in the array!
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
