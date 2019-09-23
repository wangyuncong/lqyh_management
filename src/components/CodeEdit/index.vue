<template>
  <textarea ref="mycode" class="codesql" v-model="code" style="height:200px;width:600px;"></textarea>
</template>

<script>
  import "codemirror/theme/ambiance.css";
  import "codemirror/lib/codemirror.css";
  import "codemirror/addon/hint/show-hint.css";
  import 'codemirror/theme/cobalt.css'

  let CodeMirror = require("codemirror/lib/codemirror");
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/markdown/markdown.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/r/r.js'
  import 'codemirror/mode/shell/shell.js'
  import 'codemirror/mode/sql/sql.js'
  import 'codemirror/mode/swift/swift.js'
  import 'codemirror/mode/vue/vue.js'
    export default {
        name: "codeMirror",
      data () {
        return {
          code: '//按Ctrl键进行代码提示'
        }
      },
      mounted () {
        debugger
        let mime = {
  name: "htmlmixed",
  tags: {
    style: [["type", /^text\/(x-)?scss$/, "text/x-scss"],
            [null, null, "css"]],
    custom: [[null, null, "customMode"]]
  }
}
        let theme = 'cobalt'//设置主题，不设置的会使用默认主题
        let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
          mode: mime,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: true,
          matchBrackets: true,
          theme: theme,
          autofocus: true,
          extraKeys: {'Ctrl': 'autocomplete'},//自定义快捷键
          hintOptions: {//自定义提示选项
            tables: {
              users: ['name', 'score', 'birthDate'],
              countries: ['name', 'population', 'size']
            }
          }
        })
        //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
        editor.on('onchange', function () {
          editor.showHint()
        })
      }
    }
</script>

<style scoped>
  .codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
</style>