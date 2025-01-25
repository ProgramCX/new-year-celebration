import instance from "@/utils/api/request"

class Api {
    addWish(data) {
        return instance.post('/wishes/add-wish', data);
    }
    getWishList() {
        return instance.get('/wishes/get-all');
    }
    updateWish(data) {
        return instance.put('/wishes/update', data);
    }
    getWish(data) {
        return instance.get('/wishes/get-wish?name=' + data);
    }
    addLove(data) {
        return instance.post('/wishes/add-love?name=' + data);
    }
    removeLove(data) {
        return instance.post('/wishes/remove-love?name='+ data);
    }
}

export default new Api();