export default player => {
    const { bgColor, title, date, spotifyLink } = player;

    return [
        { label: 'Background Color', name: 'bgColor', type: 'options', 
            options: [
                {name: 'Gray', value: '&theme=0'},
                {name: 'Red', value: ''}
            ],
            initialValue: bgColor
        },
        { label: 'Title', name: 'title', type: 'text', initialValue: title },
        { label: 'Release Date', name: 'date', type: 'date', initialValue: date },
        { label: 'Spotify Link', name: 'spotifyLink', type: 'text', initialValue: spotifyLink }
    ];
}