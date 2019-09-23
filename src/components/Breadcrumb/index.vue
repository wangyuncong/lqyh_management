<template>
    <div class="breadcrumb">
        <el-breadcrumb>
            <el-breadcrumb-item v-if="breadcrumb.length>0" v-for="(item,index) in breadcrumb" :to="index==0?'':item.path" :key="index">
                {{item.name}}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
    name: "Breadcrumb",
    props:["breadcrumb"],
    data(){
        return{
            
        }
    },
    mounted(){
        console.log(this.$store.global.state.breadcrumb,'pppppppdsadsaasda/////')
    },
    updated(){
        console.log(this.$router)
        console.log(this.$store.global.state.breadcrumb,'this.$store.global.state.breadcrumb')
    },
    methods:{
        // clickBreadcrumb(item,$index){
        //     console.log('ppp')
        //     if($index == this.$store.global.state.breadcrumb.length-2){
        //         this.$router.push({
        //             path: item.path
        //         })
        //     }
        // }
    }
}
</script>
<style lang="less" scoped>
    .el-breadcrumb{
        line-height: 60px;
    }
</style>

