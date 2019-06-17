const { override, fixBabelImports, addLessLoader } = require('customize-cra')

 module.exports = override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style:'css'
    //   style: true,
    }),
    // addLessLoader({
    //       javascriptEnabled: true,
    //       modifyVars: { '@primary-color': '#1DA57A' },
    //     })
)

//如果要经行样式整体替换打开注释代码即可