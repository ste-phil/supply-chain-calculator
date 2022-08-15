<template>
    <div class="nav-bar" :class="{active: isActive}">
        <div class="pie pie1" >
            <a class="pie-color" @click="changeRoute('/library')" href="#/library">
                <span class="material-icons">folder</span>
            </a>
        </div>
        <div class="pie pie2">
            <a class="pie-color" @click="changeRoute('/')" href="#/">
                <span class="material-icons">calculate</span>
            </a>
        </div>
        <div class="nav-menu" @click="isActive = !isActive" >
            <span class="material-icons">{{isActive ? "clear" : "menu"}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "nav-bar",
    data() {
        return {
            isActive: false
        }
    },
    methods: {
        changeRoute(route) {
            this.$router.push({name: route});
            this.isActive = !this.isActive;
        }
    }
}
</script>

<style scoped>
    .nav-bar {
        position: fixed;
        top: 0px;
        left: 0px;

        z-index: 3000;
    }

    .nav-menu {
        position: fixed;
        top: 0px;
        left: 0px;
        height: 4rem;
        width: 4rem;
        
        border-radius: 0 0px 100% 0;
        z-index: 3000;

        border-right: 5px solid var(--primary);
        border-bottom: 2px solid var(--primary);
        background: var(--main-background);
        cursor: pointer;

        transition: all 0.5s ease 0s;
        box-shadow: 8px 9px 19px 2px rgba(0,0,0,.2);
    }

    .nav-menu span {
        margin-top: 12px;
        margin-left: 12px;
        font-size: 1.5rem;

        transition: inherit;
    }

    .nav-menu:hover span {
        color: var(--secondary)
    }

    .pie span {
        color: inherit;
        font-size: 1.5rem;

        transition: color 0.5s;
    }


    /* Taken from https://codepen.io/ainalem/pen/YoyZpq */
    .pie {
        border-right: 5px solid var(--primary);
        border-bottom: 2px solid var(--primary);
        border-radius: 50%;
        background: var(--main-background);
        box-shadow: 8px 9px 19px 2px rgba(0,0,0,.2);

        -webkit-tap-highlight-color: transparent;

        cursor: pointer;
        height: 400px;
        left: -200px;
        position: absolute;
        top: -200px;
        width: 400px;

        transform: translateX(-200px) translateY(-200px);
        transition: transform 300ms;
        z-index: 3000;
    }
    .pie-color {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: block;
        background-image: none;

        transition: background-color 0.5s;
        color: var(--priamry);
    }
    .pie-color:hover {
        background: var(--primary);
        color: var(--secondary);
    }
    .pie1 {
        clip-path: polygon(200px 200px, 451px 450px, 0 450px);
        transition-delay: 0ms;
    }
    .pie2 {
        clip-path: polygon(200px 200px, 450px 0, 450px 451px);
        transition-delay: 30ms;
    }

    .pie1 span {
        left: 240px;
        position: absolute;
        top: 315px;
    }
    .pie2 span {
        left: 315px;
        position: absolute;
        top: 240px;
    }

    .nav-bar.active .pie {
        transform: translateX(0) translateY(0);
    }

</style>