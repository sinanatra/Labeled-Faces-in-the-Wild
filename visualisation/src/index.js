import './main.css'

const d3 = require('d3');
import * as d3Collection from 'd3-collection';

const data = d3.csv('./src/assets/dataset_2.csv');
const images = d3.json('./src/assets/images.json');

(async () => {
    let [datum, imageMap] = await Promise.all([data, images]);
    cluster(datum, imageMap)
})();


function cluster(data, imageMap) {
    data = data.filter(d => d.person != "");

    let nestedData = d3Collection.nest()
        .key(function (d) { return d.person; })
        .entries(data)
        .sort(function (a, b) { return d3.ascending(a.values, b.values); })

    nestedData = nestedData.reverse()

    const container = d3.select('.container').append('div');
    const people = container.selectAll("people")
        .data(nestedData)
        .enter()
        .append("g");

    people.append("h1")
        .text(function (d) { return d.key });

    people.append("g").selectAll("actions")
        .data(function (d) { return d.values })
        .enter()
        .append("img")
        .attr('width', 44)
        .attr('height', 44)
        .attr('background','red')
        .attr('src', function (d) {
            return imageMap[d.image];
        });
}
