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

            const artistsSortedByDate = new Map([...artistMap.entries()].sort((a,b)=> a[1] < b[1]));

            if (artistsSortedByDate.size > 0)
            {
                let artistEntryList = document.getElementById("latestArtistEntryList");

                let numToDisplay = 3;
                let artistListHtml = "";
                let artistMapKeys = artistsSortedByDate.keys();

                for (let i = artistsSortedByDate.size - 1; i >= 0; i--) {
                    if(numToDisplay > 0)
                    {
                        artistListHtml += "<li>"+ artistMapKeys.next().value +"</li>";
                        numToDisplay--;
                    }
                    else
                    {
                        break;
                    }
                }

                artistEntryList.innerHTML = artistListHtml;
            }

            //Latest songs from local database
            //Latest Artists from local database
            let songMap = new Map();

            for (let index = 0; index < data.length; index++) {
                data[index].songs.forEach(song => {
                    songMap.set(song.name, new Date(song.createdAt.$date));
                });
            }

            const songsSortedByDate = new Map([...songMap.entries()].sort((a,b)=> a[1] < b[1]));

            if (songsSortedByDate.size > 0)
            {
                let songEntryList = document.getElementById("latestSongEntryList");

                let numToDisplay = 3;
                let songListHtml = "";
                let songMapKeys = songsSortedByDate.keys();

                for (let i = songsSortedByDate.size - 1; i >= 0; i--) {
                    if(numToDisplay > 0)
                    {
                        songListHtml += "<li>"+ songMapKeys.next().value +"</li>";
                        numToDisplay--;
                    }
                    else
                    {
                        break;
                    }
                }

                songEntryList.innerHTML = songListHtml;
            }

        }).catch(err => console.error(err));
});