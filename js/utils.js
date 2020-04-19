class Utils {
    fetchParams = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        },
    };

    convertDataToMS(item) {
        return new Date(item).getTime();
    }

    convertMStoDate(item) {
        return new Date(item).toISOString();
    }

    get isDataStored() {
        return (localStorage.getItem('data') && localStorage.getItem('dataDetails') != null);
    }

    isObjectEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
}

export default new Utils();