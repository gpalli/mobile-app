import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { STOCKS } from '../../shared';

@Component({
    // encapsulation: ViewEncapsulation.None,
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    // styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

    // title = 'Line Chart';

    @Input() data: any[] = STOCKS;
    @Input() xAxisText = '';

    private margin = { top: 20, right: 20, bottom: 30, left: 50 };
    public width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private line: d3Shape.Line<[number, number]>;

    constructor() {
    }

    ngOnInit() {
        this.width = 450 - this.margin.left - this.margin.right;
        this.height = 250 - this.margin.top - this.margin.bottom;
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawLine();
    }

    private initSvg() {
        this.svg = d3.select('svg')
            .call(this.responsivefy)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private initAxis() {
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.x.domain(d3Array.extent(this.data, (d) => d.date));
        // this.y.domain(d3Array.extent(this.data, (d) => d.value));
        this.y.domain([0, this.height]);
    }

    private drawAxis() {

        this.svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3Axis.axisBottom(this.x));

        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3Axis.axisLeft(this.y))
            .append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(this.xAxisText);
    }

    private drawLine() {
        this.line = d3Shape.line()
            .x((d: any) => this.x(d.date))
            .y((d: any) => this.y(d.value));

        this.svg.append('path')
            .datum(this.data)
            .attr('class', 'line')
            .attr('d', this.line);

        // this.svg.selectAll('path')
        //     .data(this.data)
        //     .enter().append('g')
        //     .append('text')
        //     .attr('class', 'below')
        //     .attr('x', 12)
        //     .attr('dy', '1.2em')
        //     .attr('text-anchor', 'left')
        //     .text(function (d) { return d.value; })
        //     .style('fill', '#000000');
    }

    responsivefy(svg) {
        let width = 480;
        let height = 320;
        // get container + svg aspect ratio
        let container = d3.select(svg.node().parentNode),
            aspect = width / height;
        // width = Number(svg.style('width')),
        // height = Number(svg.style('height')),

        console.log(width);

        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr('viewBox', '0 0 ' + width + ' ' + height)
            .attr('perserveAspectRatio', 'xMinYMid')
            .call(resize);

        // to register multiple listeners for same event type,
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on('resize.' + container.attr('id'), resize);

        // get width of container and resize svg to fit it
        function resize() {
            let targetWidth = Number(container.style('width'));
            svg.attr('width', targetWidth);
            svg.attr('height', Math.round(targetWidth / aspect));
        }
    }

}
