export default {
    verifyAuth() {
        console.log("[passed]")
        return (localStorage.getItem('DD101_TOKEN') === 'logged');
    },
    authenticate(cb) {
        localStorage.setItem('DD101_TOKEN', 'logged');
        cb();
    },
    signout(cb) {
        localStorage.setItem('DD101_TOKEN', undefined);
        cb();
    }
}