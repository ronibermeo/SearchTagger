document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('genero-input');
    const genreDrawer = document.getElementById('genre-drawer');
    const genreList = document.getElementById('genre-list');

    const fetchGeneros = async (query) => {
        try {
            const response = await fetch(`get_all_generos.php?query=${query}`);
            const data = await response.json();
            renderGenres(data, query);
        } catch (error) {
            console.error('Error al cargar los géneros:', error);
        }
    };

    const renderGenres = (generos, query) => {
        genreList.innerHTML = '';
        const queryLower = query.toLowerCase();

        // Filtrar y ordenar géneros
        const filteredGeneros = generos.filter(g => g.toLowerCase().includes(queryLower));
        const orderedGeneros = filteredGeneros.sort((a, b) => 
            a.toLowerCase().startsWith(queryLower) - b.toLowerCase().startsWith(queryLower)
        );

        // Mostrar géneros
        orderedGeneros.forEach(genero => {
            const li = document.createElement('li');
            li.innerHTML = highlightQuery(genero, query);
            li.onclick = () => addGenreTag(genero);
            genreList.appendChild(li);
        });
    };

    const highlightQuery = (text, query) => {
        const regex = new RegExp(`(${query.split('').join('|')})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    const addGenreTag = (genre) => {
        const tag = document.createElement('div');
        tag.className = 'item-container';
        tag.innerHTML = `
            <span class="item-label">${genre}</span>
            <button class="remove-tag">×</button>
        `;
        tag.querySelector('.remove-tag').onclick = () => tag.remove();
        input.parentNode.insertBefore(tag, input);
        genreDrawer.classList.add('hidden');
        input.value = '';
    };

    input.addEventListener('input', () => {
        const query = input.value.trim();
        query ? (fetchGeneros(query), genreDrawer.classList.remove('hidden')) : genreDrawer.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !genreDrawer.contains(e.target)) {
            genreDrawer.classList.add('hidden');
        }
    });

    // CSS para resaltado
    document.styleSheets[0].insertRule('.highlight { color: red; font-weight: 200; }', 0);
});
