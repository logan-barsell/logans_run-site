export default video => {
    const { category, title, date, link } = video;

    return [
        { label: 'Category', name: 'category', type: 'options', 
            options: [
                {name: 'Music Videos', value: 'musicVids'},
                {name: 'Live Performances', value: 'liveVids'}, 
                {name: 'Vlogs', value: 'vlogs'}
            ],
            initialValue: category
        },
        { label: 'Title', name: 'title', type: 'text', initialValue: title },
        { label: 'Release Date', name: 'date', type: 'date', initialValue: date },
        { label: 'YouTube Share Link', name: 'link', type: 'text', initialValue: link }
    ];
}