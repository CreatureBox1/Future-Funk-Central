document.addEventListener("DOMContentLoaded", () => {

    fetch('http://localhost:8080/database/artists.json')
        .then(res => res.json())
        .then((data) => {

            //Latest Artists from local database
            let artistMap = new Map();

            for (let index = 0; index < data.length; index++) {
                //console.log(new Date(data[index].createdAt.$date).getTime());
                artistMap.set(data[index].name, new Date(data[index].createdAt.$date))
            }

            const artistsSortedByKey = new Map([...artistMap.entries()].sort((a,b)=> a > b));
            console.log(artistsSortedByKey);

            //Latest songs from local database

        }).catch(err => console.error(err));
});