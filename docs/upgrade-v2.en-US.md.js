webpackJsonp([46],{2479:function(n,e){n.exports={content:["article",["p","In addition to many features in the Ant Design Pro 2.0 release, we also upgraded the front-end build tool from roadhog to ",["a",{title:null,href:"https://umijs.org/"},"UmiJS"]," (referred to as umi). The reason for upgrading, not replacement, is that umi is more than just a front-end build tool. It also includes routing and a plugin system for building a complete React application."],["p","So if you want to better add the feature of Ant Design Pro 2.0 to your original project and port the 2.0 code to your project, you'd better migrate your project from roadhog to umi. This document will guide you through the migration process. Before that, you may need to read umi's ",["a",{title:null,href:"https://umijs.org/guide/"},"documentation"]," so that you have a preliminary understanding of umi. This is will helpful for your Migration work. The following are the overview of migration steps, and there will be more detail later."],["p","Note: This migration guide is based on the latest v1 version, and you can find the changes in the ",["a",{title:null,href:"https://github.com/ant-design/ant-design-pro/commit/dc2118db78f9b2b7072051fea558e8d1386ce34c"},"commit"],". This commit is for reference only and cannot be directly applied to your project. if your version is too old, there may be some difference in detail. Please migrate with the specific situation."],["h2","Migration Steps Overview"],["ul",["li",["p","Change the dependency of ",["code","package.json"]," roadhog to umi. "]],["li",["p","Modify the configuration in ",["code",".webpackrc.js"]," to ",["code","config/config.js"],"."]],["li",["p","Modify the ",["code","src/ruotes"]," directory name to pages, where pages are the umi agreed directories."]],["li",["p","Remove ",["code","src/models/index.js"]," and the dva model in the models folder in umi will be mounted automatically."]],["li",["p","Rename ",["code","index.ejs"]," to ",["code","pages/document.ejs"],", which is the file agreed by umi."]],["li",["p","Modify ",["code","index.less"]," to ",["code","global.less"]," and modify ",["code","index.js"]," to ",["code","global.js"],", which are also umi-constrained files."]],["li",["p","Add route configuration routes in ",["code","config/config.js"],"."]],["li",["p","Modify the component nesting syntax in ",["code","src/layouts/BasicLayout.js"],"."]],["li",["p","Modify the 404 page."]],["li",["p","Modify the logic of the authorization route AuthorizedRoute."]],["li",["p","Modify the mock."]],["li",["p","Add umi related files to ",["code",".gitignore"],"."]],["li",["p","Modify possible problems by executing ",["code","tnpm start"]," and ",["code","tnpm run lint"],"."]]],["h2","Migration step details"],["h3","Modify roadhog dependency to umi"],["p","Open ",["code","package.json"]," in the root directory of the project and change the dependency to umi:"],["pre",{lang:"diff",highlighted:'"dependencies": {\n<span class="token deleted">- "dva": "^2.2.3",</span>\n<span class="token deleted">- "dva-loading": "^2.0.3",</span>\n<span class="token deleted">- "antd": "^3.8.0",</span>\n<span class="token deleted">- "react": "^16.4.1",</span>\n<span class="token deleted">- "react-dom": "^16.4.1",</span>\n<span class="token deleted">- "react-loadable": "^5.5.0",</span>\n<span class="token inserted">+ "umi-plugin-react": "^1.0.0-beta.21"</span>\n},\n"devDependencies": {\n<span class="token inserted">+ "umi": "^2.0.0-beta.21",</span>\n<span class="token deleted">- "roadhog": "^2.4.2",</span>\n<span class="token deleted">- "roadhog-api-doc": "^1.1.2",</span>\n}'},["code",'"dependencies": {\n- "dva": "^2.2.3",\n- "dva-loading": "^2.0.3",\n- "antd": "^3.8.0",\n- "react": "^16.4.1",\n- "react-dom": "^16.4.1",\n- "react-loadable": "^5.5.0",\n+ "umi-plugin-react": "^1.0.0-beta.21"\n},\n"devDependencies": {\n+ "umi": "^2.0.0-beta.21",\n- "roadhog": "^2.4.2",\n- "roadhog-api-doc": "^1.1.2",\n}']],["p","React is built into umi, and a library commonly used by React technology stacks such as antd and dva is built into the umi-plugin-react plugin set. See ",["a",{title:null,href:"https://umijs.org/plugin/umi-plugin-react.html"},"Minor-plugin-react documentation"],"."],["p","In addition, the scripts in ",["code","package.json"]," also need to be modified accordingly:"],["pre",{lang:"diff",highlighted:'<span class="token deleted">- "start": "cross-env ESLINT=none roadhog dev",</span>\n<span class="token deleted">- "start:no-proxy": "cross-env NO_PROXY=true ESLINT=none roadhog dev",</span>\n<span class="token deleted">- "build": "cross-env ESLINT=none roadhog build",</span>\n<span class="token inserted">+ "start": "umi dev",</span>\n<span class="token inserted">+ "start:no-mock": "cross-env MOCK=none umi dev",</span>\n<span class="token inserted">+ "build": "umi build",</span>'},["code",'- "start": "cross-env ESLINT=none roadhog dev",\n- "start:no-proxy": "cross-env NO_PROXY=true ESLINT=none roadhog dev",\n- "build": "cross-env ESLINT=none roadhog build",\n+ "start": "umi dev",\n+ "start:no-mock": "cross-env MOCK=none umi dev",\n+ "build": "umi build",']],["p","Remember to don't forget to update the dependency to the latest with ",["code","npm update"]," after the modification is complete."],["h3","Add configuration file config/config.js"],["p","Umi has agreed on ",["code",".umirc.js"]," and ",["code","config/config.js"]," as umi's configuration files (choose one). In Ant Design Pro, because of the more configuration, we choose to use ",["code","config/config.js"],"."],["p","You need to create ",["code","config/config.js"]," in your project. This configuration file needs to export an object by default, which contains all the configuration of umi. You can initialize it to the following:"],["pre",{lang:"js",highlighted:'<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n  plugins<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">[</span>\n    <span class="token string">\'umi-plugin-react\'</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      antd<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      dva<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        hmr<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>'},["code","export default {\n\xa0\xa0plugins: [[\n\xa0\xa0\xa0\xa0'umi-plugin-react',\n\xa0\xa0\xa0\xa0{\n\xa0\xa0\xa0\xa0\xa0\xa0antd: true,\n\xa0\xa0\xa0\xa0\xa0\xa0dva: {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hmr: true,\n\xa0\xa0\xa0\xa0\xa0\xa0},\n\xa0\xa0\xa0\xa0}\n\xa0\xa0]]\n};"]],["p","This configuration mounts the umi-plugin-react plugin set and opens the antd and dva plugins, allowing you to use antd and dva directly in your project."],["p","After adding ",["code","config/config.js"]," you can also migrate the configuration from ",["code",".webpackrc.js"]," under your project to ",["code","config/config.js"],". ",["code",".webpackrc.js"]," is the af-webpack configuration file, umi and roadhog are dependent on it, so you can migrate directly. After the migration, you can delete the original ",["code",".webpackrc.js"]," and ",["code",".babelrc.js"]," files."],["p","However, it should be noted that the following configuration in ",["code",".webpackrc.js"]," is not necessary to copy into ",["code","config/config.js"],":"],["ul",["li",["p","entry: umi will have a default routing mechanism that needs to be removed."]],["li",["p","extraBabelPlugins: umi-plugin-react has built-in support for on-demand compilation of antd, no need to manually configure."]],["li",["p","The dva-hmr plugin under env: env is no longer needed and can be opened directly in the umi-plugin-react configuration."]],["li",["p","alias: umi will add the alias of ",["code","@/"]," to the src directory by default."]],["li",["p","html: umi uses ",["code","src/pages/document.ejs"]," as the html template by default."]]],["p","In addition, we recommend writing the ",["code","theme"]," configuration directly to ",["code","config/config.js"],", and then you can delete ",["code","src/theme.js"],"."],["h3","Modify ruotes to pages"],["p","A lot of conventions and configurations are used in umi to efficiently implement some functions, where umi agrees that the ",["code","src/pages"]," directory is the directory where the page components are stored. In Ant Design Pro 1.0, our pages are stored under ",["code","src/routes"],", so we only need to rename the routes to pages."],["h3","Delete models/index.js"],["p","In umi, after the dva plugin is mounted, the files under models will be introduced as dva model by default, so you no longer need to manually mount the model in ",["code","models/index.js"],", you can delete the file directly."],["h3","Modify index.ejs"],["p","Move ",["code","index.ejs"]," to ",["code","pages/document.ejs"],", which is the file agreed by umi. Reference ",["a",{title:null,href:"https://umijs.org/guide/html-template.html"},"\u0153umi HTML template\nDocumentation"],"."],["h3","Modify index.js and index.less"],["p","Rename ",["code","index.js"]," to ",["code","global.js"]," and rename ",["code","index.less"]," to ",["code","global.less"]," and they will be mounted automatically by umi. You can refer to umi's ",["a",{title:null,href:"https://umijs.org/guide/app-structure.html"},"Directory Convention"],". In addition, because the dva plugin will automatically mount the model and add the dva-loading plugin by default, the dva related content in index.js can be removed. Just keep the initialization logic like this:"],["pre",{lang:"js",highlighted:'<span class="token keyword">import</span> <span class="token string">\'./polyfill\'</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token string">\'moment/locale/zh-cn\'</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token string">\'./rollbar\'</span><span class="token punctuation">;</span>'},["code","import './polyfill';\nimport 'moment/locale/zh-cn';\nimport './rollbar';"]],["p","In addition, the ",["code",":global"]," flag in ",["code","global.less"]," can also be removed, because the style in ",["code","global.less"]," is global by default. It should be noted that cssModule is used by default except for it."],["h3","Add routing configuration"],["p","This step is the most important, umi has built-in routing implementation, providing both agreed and configured routing. In Ant Design Pro we use the way of profile routing. You need to add the configuration item ",["code","routes"]," in ",["code","config/config.js"],", here we provide a sample based on the ",["code","/dashboard"]," page, you need to do the migration according to your project. We recommend adding a ",["code","config/router.config.js"]," file and introducing it in ",["code","config/config.js"],":"],["pre",{lang:"js",highlighted:'<span class="token comment" spellcheck="true">// config/router.config.js</span>\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    path<span class="token punctuation">:</span> <span class="token string">\'/\'</span><span class="token punctuation">,</span>\n    component<span class="token punctuation">:</span> <span class="token string">\'../layouts/BasicLayout\'</span><span class="token punctuation">,</span>\n    routes<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n      <span class="token comment" spellcheck="true">// dashboard</span>\n      <span class="token punctuation">{</span> path<span class="token punctuation">:</span> <span class="token string">\'/\'</span><span class="token punctuation">,</span> redirect<span class="token punctuation">:</span> <span class="token string">\'/dashboard/analysis\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        path<span class="token punctuation">:</span> <span class="token string">\'/dashboard\'</span><span class="token punctuation">,</span>\n        name<span class="token punctuation">:</span> <span class="token string">\'dashboard\'</span><span class="token punctuation">,</span>\n        icon<span class="token punctuation">:</span> <span class="token string">\'dashboard\'</span><span class="token punctuation">,</span>\n        routes<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n          <span class="token punctuation">{</span> path<span class="token punctuation">:</span> <span class="token string">\'/dashboard/analysis\'</span><span class="token punctuation">,</span> name<span class="token punctuation">:</span> <span class="token string">\'analysis\'</span><span class="token punctuation">,</span> component<span class="token punctuation">:</span> <span class="token string">\'./Dashboard/Analysis\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          <span class="token punctuation">{</span> path<span class="token punctuation">:</span> <span class="token string">\'/dashboard/monitor\'</span><span class="token punctuation">,</span> name<span class="token punctuation">:</span> <span class="token string">\'monitor\'</span><span class="token punctuation">,</span> component<span class="token punctuation">:</span> <span class="token string">\'./Dashboard/Monitor\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          <span class="token punctuation">{</span> path<span class="token punctuation">:</span> <span class="token string">\'/dashboard/workplace\'</span><span class="token punctuation">,</span> name<span class="token punctuation">:</span> <span class="token string">\'workplace\'</span><span class="token punctuation">,</span> component<span class="token punctuation">:</span> <span class="token string">\'./Dashboard/Workplace\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>'},["code","// config/router.config.js\nmodule.exports = [\n\xa0\xa0{\n\xa0\xa0\xa0\xa0path: '/',\n\xa0\xa0\xa0\xa0component: '../layouts/BasicLayout',\n\xa0\xa0\xa0\xa0routes: [\n\xa0\xa0\xa0\xa0\xa0\xa0// dashboard\n\xa0\xa0\xa0\xa0\xa0\xa0{ path: '/', redirect: '/dashboard/analysis' },\n\xa0\xa0\xa0\xa0\xa0\xa0{\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0path: '/dashboard',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0name: 'dashboard',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0icon: 'dashboard',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0routes: [\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0{ path: '/dashboard/analysis', name: 'analysis', component: './Dashboard/Analysis' },\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0{ path: '/dashboard/monitor', name: 'monitor', component: './Dashboard/Monitor' },\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0{ path: '/dashboard/workplace', name: 'workplace', component: './Dashboard/Workplace' },\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0],\n\xa0\xa0\xa0\xa0\xa0\xa0},\n\xa0\xa0\xa0\xa0],\n\xa0\xa0},\n];"]],["p","Where component is a string, relative to the path of ",["code","src/pages"],", for more routing configuration you can refer to the v2 version of the routing configuration, and umi's documentation. In addition, the original 1.0 version of the routing code ",["code","src/common/router.js"]," and ",["code","src/router.js"]," can also be deleted."],["h3","Modify layout components"],["p","Because component routing is not used with react-router@4, you will need to modify your layout components. Change the ",["code","<Switch/>"]," component part to ",["code","{this.props.children}"],"."],["h3","Modify 404 page"],["p","By default, ",["code","src/pages/404.js"]," is used as the 404 page in umi, you need to migrate the original ",["code","src/routes/Exception/404.js"],"."],["h3","Modify permission routing"],["p","In 2.0, you can use the ",["span","Permissions Routing"]," provided by umi directly (",["a",{title:null,href:"https://umijs.org/guide/router.html#%E6%9D%83%E9%99%90%E8%B7%AF%E7"},"https://umijs.org/guide/router.html#%E6%9D%83%E9%99%90%E8%B7%AF%E7"]," %94%B1) program. Of course, you can also keep the scheme in 1.0 to continue to use. Since it is not necessary, it will not be specified in this article."],["h3","Modifying mock data"],["p","In umi, the ",["code","mock/*.js"]," file is used as the mock file by default. So you can delete the ",["code",".roadhogrc.mock.js"]," file after migrating the URL information of the mock data to the mock file, but note that the mock data written directly in ",["code",".roadhogrc.mock.js"]," needs to be migrated, for example You can migrate this part of the data by creating a new ",["code","mock/common.js"],"."],["p","For more instructions, please refer to umi's documentation ",["a",{title:null,href:"https://umijs.org/guide/mock-data.html"},"Mock Data"],"."],["h3","Modify .gitignore"],["p","After using umi you need to add the temporary files of umi in development and build to ",["code",".gitignore"],"."],["pre",{lang:null,highlighted:'<span class="token punctuation">.</span>umi\n<span class="token punctuation">.</span>umi<span class="token operator">-</span>production'},["code",".umi\n.umi-production"]],["h3","Modify code alias and other details"],["p","After the above operation is completed, you can run ",["code","npm start"]," to start your project. You will see an error, but don't panic, follow the error message and modify it step by step. What you may need to modify is:"],["ul",["li",["p","Modify the alias ",["code","components/"]," to ",["code","@/components"],". Of course, you can also keep the original alias directly in ",["code","config/config.js"],"."]],["li",["p","Modify the part related to dva in ",["code","src/utils/request.js"],". You can use ",["code","umi/router"]," to do the jump directly."]],["li",["p",["code","/exception/400"]," of ",["code","src/utils/request.js"]," can be changed to ",["code","/400"],"."]],["li",["p","Remove ",["code","const baseRedirect = this.getBaseRedirect();"]," related logic in ",["code","BasicLayout"],", the logic of the jump can be implemented through umi's routes configuration."]],["li",["p","Modify the related logic of ",["code","getPageTitle"]," and ",["code","getBreadcrumbNameMap"]," in ",["code","BasicLayout"],", refer to the following code implementation. Complete code reference v1 upgrade ",["a",{title:null,href:"https://github.com/ant-design/ant-design-pro/commit/dc2118db78f9b2b7072051fea558e8d1386ce34c"},"commit"],"."]]],["p","Note: ",["code","memoizeOne"]," is the method provided by the ",["code","memoize-one"]," npm package. You need to install memoize-one first. ",["code","deepEqual"]," is provided by the ",["code","lodash.isequal"]," package, and related dependencies need to be installed."],["pre",{lang:"js",highlighted:'<span class="token comment" spellcheck="true">/**\n * Get breadcrumb mapping\n * @param {Object} menuData menu configuration\n */</span>\n<span class="token keyword">const</span> getBreadcrumbNameMap <span class="token operator">=</span> <span class="token function">memoizeOne</span><span class="token punctuation">(</span>meun <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> routerMap <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> mergeMeunAndRouter <span class="token operator">=</span> meunData <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>\n    meunData<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>meunItem <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>meunItem<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n<span class="token function">        mergeMeunAndRouter</span><span class="token punctuation">(</span>meunItem<span class="token punctuation">.</span>children<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment" spellcheck="true">// Reduce memory usage</span>\n      routerMap<span class="token punctuation">[</span>meunItem<span class="token punctuation">.</span>path<span class="token punctuation">]</span> <span class="token operator">=</span> meunItem<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token function">  mergeMeunAndRouter</span><span class="token punctuation">(</span>meun<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> routerMap<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> deepEqual<span class="token punctuation">)</span><span class="token punctuation">;</span>'},["code","/**\n\xa0* Get breadcrumb mapping\n\xa0* @param {Object} menuData menu configuration\n\xa0*/\nconst getBreadcrumbNameMap = memoizeOne(meun => {\n\xa0\xa0const routerMap = {};\n\xa0\xa0const mergeMeunAndRouter = meunData => {\n\xa0\xa0\xa0\xa0meunData.forEach(meunItem => {\n\xa0\xa0\xa0\xa0\xa0\xa0if (meunItem.children) {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0mergeMeunAndRouter(meunItem.children);\n\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0// Reduce memory usage\n\xa0\xa0\xa0\xa0\xa0\xa0routerMap[meunItem.path] = meunItem;\n\xa0\xa0\xa0\xa0});\n\xa0\xa0};\n\xa0\xa0mergeMeunAndRouter(meun);\n\xa0\xa0return routerMap;\n}, deepEqual);"]],["p","In addition to the project can start normally, you should also run ",["code","tnpm run lint"]," to solve the lower-level problems that occur in the migration process. The problems and scenarios you may need to deal with are as follows:"],["ul",["li",["p",["code","no-unused-vars"]," error, you can delete it without checking the problem."]],["li",["p",["code","react/destructuring-assignment"]," error, you may need to modify something like ",["code","this.props.children"]," for ",["code","const { children } = this.props"],"."]]],["p","In addition, we recommend that you migrate to the 2.0 recommended lint rules to make your code more elegant."],["h2","Using the new features in 2.0"],["p","It's easy to use the new 2.0 features after the roadhog to umi migration. In 2.0 we have the following new features added:"],["ul",["li",["p","Add a user information page."]],["li",["p","Support internationalization."]],["li",["p","Support for style switching."]]],["h3","Add account page"],["p","You only need to copy the related code in the v2 ",["code","pages"]," directory to your project and modify the routes configuration in ",["code","config/config.js"],". This part is relatively simple, and I won't explain too much here. In addition to the new user information page, you can also refer to the update of other pages to jump to the code in your own project."],["h3","Support internationalization"],["p","In Ant Design Pro 2.0 we used the umi plugin ",["code","umi-plugin-locale"]," for i18n. The plugin has also been built into the ",["code","umi-plugin-react"]," plugin set. You can turn on i18n by adding the ",["code","locale"]," configuration to the configuration of the collection."],["p","After opening the i18n plugin, you can add the ",["code","locales"]," folder in the project directory, add the i18n resource file according to the convention, and then you can internationalize by using the API exposed by ",["code","umi/locale"]," in the project."],["p","More about the ",["code","umi-plugin-locale"]," configuration can be plugged into its ",["a",{title:null,href:"https://umijs.org/plugin/umi-plugin-react.html#locale"},"documentation"],"."],["h3","Support theme switching"],["p","Ant Design Pro uses less and cssModule as a style solution. You can configure this theme style by configuring lessVars at compile time. This function is built in umi. You can configure ",["code","theme"]," in the configuration file. Refer to umi's ",["a",{title:null,href:"https://umijs.org/config/#theme"},"Configuration Documentation"],"."],["p","However, the adjustment of the navigation layout mode supported by the v2 version is mainly the upgrade of the business logic of the code. You can refer to the code of ",["code","src/layouts/BasicLayout.js"]," in the v2 code for adjustment."],["p","For online theme switching, because less is compiled at build time, in order to achieve switching, you need to support less in online compilation and other issues. To solve this problem, we developed the ",["code","ant-design-theme"]," webpack plugin and the ",["code","merge-less"]," plugin to implement this feature. if you need it, you can add the related code by referring to ",["code","config/plugin.config.js"]," and ",["code","src/models/setting.sj"]," in the v2 code."],["h3","More"],["p","See Ant Design Pro 2.0 ",["a",{title:null,href:"https://medium.com/ant-design/beautiful-and-powerful-ant-design-pro-2-0-release-51358da5af95"},"release log"]," for more details."]],meta:{order:24,title:"Upgrade to V2",type:"Other",filename:"docs/upgrade-v2.en-US.md"},toc:["ul",["li",["a",{className:"bisheng-toc-h2",href:"#Migration-Steps-Overview",title:"Migration Steps Overview"},"Migration Steps Overview"]],["li",["a",{className:"bisheng-toc-h2",href:"#Migration-step-details",title:"Migration step details"},"Migration step details"]],["li",["a",{className:"bisheng-toc-h2",href:"#Using-the-new-features-in-2.0",title:"Using the new features in 2.0"},"Using the new features in 2.0"]]]}}});