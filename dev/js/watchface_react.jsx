/* eslint-disable no-unused-vars */
/* global UIkit */
import React from 'react';
import ReactDOM from 'react-dom';
import wfe from './wfe_obj';
import {$ as $, div as div} from './utils';

/**
 * Renders image element
 *
 * @class ImageElement
 * @extends {React.Component}
 */
class ImageElement extends React.Component {
    /**
     * Get src of images, depend on value
     *
     * @returns {object} image src
     * @memberof ImageElement
     * 
     */
    getImage() {
        if (this.props.value) {
            return $(this.props.el.ImageIndex + Number(this.props.value)).src;
        } 
        return $(this.props.el.ImageIndex).src;
    }

    render() {
        return (
            <img src={this.getImage()} style={{top: this.props.el.Y + 'px',
                left: this.props.el.X + 'px'}} />
        );
    }
}

/**
 * Renders status icon (alarm, DnD, Bt, lock)
 *
 * @class StatusElement
 * @extends {React.Component}
 */
class StatusElement extends React.Component {
    render() {
        if (this.props.value && this.props.el.ImageIndexOn)
            return (
                <img src={$(this.props.el.ImageIndexOn).src} style={{top: this.props.el.Coordinates.Y + 'px', left: this.props.el.Coordinates.X + 'px'}}/>
            );
        else if (!(this.props.value) && this.props.el.ImageIndexOff)
            return (
                <img src={$(this.props.el.ImageIndexOff).src} style={{top: this.props.el.Coordinates.Y + 'px', left: this.props.el.Coordinates.X + 'px'}}/>
            );
    }
}

/**
 * Renders segments elements
 *
 * @class SegmentsElement
 * @extends {React.Component}
 */
class SegmentsElement extends React.Component {
    render() {
        let el = this.props.el,
            end = Math.ceil(this.props.value / (this.props.maxValue / (el.Segments.length - 1))),
            itemsList = [];
        for (let i = 0; i <= end; i++) {
            // let t = $(el.StartImageIndex + i);
            itemsList.push(<img src={$(el.StartImageIndex + i).src} style={{top: el.Segments[i].Y + 'px', left: el.Segments[i].X + 'px'}} />);
            // setPos(t, this.props.el.Segments[i]);
            // insert(t, "c_battery_scale");
        }
        return (
            itemsList
        );
    }
}

/**
 * Renders multiply images inside TopLeft&BottomRight
 *
 * @class BlockElement
 * @extends {React.Component}
 */
class BlockElement extends React.Component {
    /**
     * Makes lists of images srcs and position
     * 
     * Uses class.props.el, class.props.value, *class.props.extra
     *
     * @returns {[]} list of objects [{src: ..., left: ..., top: ...}, ...]
     * @memberof BlockElement
     */
    makeBlock() {
        let el = null,
            extra = this.props.extra || {},
            value = this.props.value.toString(),
            block = [],
            width = 0;
        if (value[0] === '-')
            value = value.slice(1);
        if (this.props.el.Number) {
            el = this.props.el.Number;
            if (this.props.el.DegreesImageIndex)
                extra.SuffixImageIndex = this.props.el.DegreesImageIndex;
            if (this.props.el.SuffixImageIndex)
                extra.SuffixImageIndex = this.props.el.SuffixImageIndex;
            if (this.props.el.PrefixImageIndex)
                extra.PrefixImageIndex = this.props.el.PrefixImageIndex;
            if (this.props.el.MinusSignImageIndex)
                extra.MinusSignImageIndex = this.props.el.MinusSignImageIndex;
            if (this.props.el.MinusImageIndex)
                extra.MinusSignImageIndex = this.props.el.MinusImageIndex;
            if (this.props.el.EmptyImageIndex)
                extra.EmptyImageIndex = this.props.el.EmptyImageIndex;
        } else
            el = this.props.el;
        for (let i in value) {
            let t = $(el.ImageIndex + Number(value[i]));
            block.push({
                src: t.src,
                width: t.width,
                height: t.height
            });
            width += t.width + el.Spacing;
        }
        // props.extra
        if (extra) {
            if (extra.secondPart) {
                let delimiter = $(extra.DelimiterImageIndex);
                value = extra.secondPart.toString();
                if (value[0] === '-')
                    value = value.slice(1);
                block.push({
                    src: delimiter.src,
                    width: delimiter.width,
                    height: delimiter.height
                });
                width += delimiter.width + el.Spacing;
                if (extra.MinusSignImageIndex && Number(extra.secondPart) < 0) {
                    let prefix = $(extra.MinusSignImageIndex);
                    block.push({
                        src: prefix.src,
                        width: prefix.width,
                        height: prefix.height
                    });
                    width += prefix.width + el.Spacing;
                }
                for (let i in value) {
                    let t = $(el.ImageIndex + Number(value[i]));
                    block.push({
                        src: t.src,
                        width: t.width,
                        height: t.height
                    });
                    width += t.width + el.Spacing;
                }
                width += el.Spacing;
            }

            if (extra.PrefixImageIndex) {
                let prefix = $(extra.PrefixImageIndex);
                block = [{
                    src: prefix.src,
                    width: prefix.width,
                    height: prefix.height
                }].concat(block);
                width += prefix.width + el.Spacing;
            }

            if (extra.MinusSignImageIndex && Number(this.props.value) < 0) {
                let prefix = $(extra.MinusSignImageIndex);
                block = [{
                    src: prefix.src,
                    width: prefix.width,
                    height: prefix.height
                }].concat(block);
                width += prefix.width + el.Spacing;
            }

            if (extra.SuffixImageIndex) {
                let suffix = $(extra.SuffixImageIndex);
                block.push({
                    src: suffix.src,
                    width: suffix.width,
                    height: suffix.height
                });
                width += suffix.width + el.Spacing;
            }
        }
        width -= el.Spacing;
        return {
            el,
            block,
            width
        };
    }

    /**
     * Position items
     *
     * @param {*} obj el, block, width from this.makeBlock
     * @returns {[]} list
     * @memberof BlockElement
     */
    buildBlock(obj) {
        let el = obj.el,
            block = obj.block,
            width = obj.width,
            offset = 0,
            topoffset = null,
            t = null,
            list_to_render = [];
        switch (el.Alignment) {
        case 18:
        case "TopLeft":
            block.reverse();
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.TopLeftX + offset,
                    top: el.TopLeftY
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 24:
        case "TopCenter":
        case "Top":
            block.reverse();
            offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.TopLeftX + offset,
                    top: el.TopLeftY
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 20:
        case "TopRight":
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.BottomRightX - t.width + 1 - offset,
                    top: el.TopLeftY
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 66:
        case "CenterLeft":
        case 'Left':
            block.reverse();
            topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.TopLeftX + offset,
                    top: el.TopLeftY + topoffset
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 72:
        case "Center":
        case "VCenter":
        case "HCenter":
            block.reverse();
            offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
            topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.TopLeftX + offset,
                    top: el.TopLeftY + topoffset
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 68:
        case "CenterRight":
        case "Right":
            topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.BottomRightX - t.width + 1 - offset,
                    top: el.TopLeftY + topoffset
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 34:
        case "BottomLeft":
            block.reverse();
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.TopLeftX + offset,
                    top: el.BottomRightY - t.height + 1
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 40:
        case "BottomCenter":
        case "Bottom":
            block.reverse();
            offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.TopLeftX + offset,
                    top: el.BottomRightY - t.height + 1
                });
                offset += t.width + el.Spacing;
            }
            break;
        case 36:
        case "BottomRight":
            while (block.length) {
                t = block.pop();
                list_to_render.push({
                    src: t.src,
                    left: el.BottomRightX - t.width + 1 - offset,
                    top: el.BottomRightY - t.height + 1
                });
                offset += t.width + el.Spacing;
            }
            break;
        default:
            UIkit.notification("Alignment <b>(" + el.Alignment + ")</b> is incorrect. You made a mistake", {
                status: 'danger',
                pos: 'top-left',
                timeout: 7500
            });
        }
        return list_to_render;
    }

    /**
     * Result of makeBlock converts to JSX
     *
     * @param {[]} list_to_render list of objects
     * @returns {[]} JSX images list
     * @memberof BlockElement
     */
    makeJSX(list_to_render) {
        return list_to_render.map(el => <img src={el.src} style={{top: el.top + 'px', left: el.left + 'px'}} />);
    }

    render() {
        return ( 
            this.makeJSX(this.buildBlock(this.makeBlock()))
        );
    }
}

/**
 * Main watchface block
 *
 * @class Watchface
 * @extends {React.Component}
 */
class Watchface extends React.Component {
    render() {
        if (!this.props.coords)
            return;
        let am = null,
            hours = this.props.data.timeOnClock[0];
        if (this.props.coords.amPm) {
            if (Number(this.props.data.timeOnClock[0]) > 12) {
                hours = (Number(this.props.data.timeOnClock[0]) - 12).toString();
                am = true;
            }
            am = false;
        }
        return (
            <div>
                {this.props.coords.bg &&
                    <ImageElement el={this.props.coords.bg.Image}/>
                }
                {this.props.coords.time &&
                    [
                        <ImageElement el={this.props.coords.time.Hours.Ones} value={hours[1]} key={'hours.ones'}/>,
                        <ImageElement el={this.props.coords.time.Hours.Tens} value={hours[0]} key={'hours.tens'}/>,
                        <ImageElement el={this.props.coords.time.Minutes.Tens} value={this.props.data.timeOnClock[1][0]} key={'minutes.tens'}/>,
                        <ImageElement el={this.props.coords.time.Minutes.Ones} value={this.props.data.timeOnClock[1][1]} key={'minutes.ones'}/>
                    ]
                }
                {am !== null && (
                    am ? <img src={$(this.props.coords.amPm.ImageIndexAm).src} style={{top: this.props.coords.amPm.Y + 'px', left: this.props.coords.amPm.X + 'px'}} /> : <img src={$(this.props.coords.amPm.ImageIndexPm).src} style={{top: this.props.coords.amPm.Y + 'px', left: this.props.coords.amPm.X + 'px'}} />
                )

                }
                {this.props.coords.seconds &&
                    [
                        <ImageElement el={this.props.coords.seconds.Ones} value={this.props.data.seconds[1]} key={'seconds.ones'}/>,
                        <ImageElement el={this.props.coords.seconds.Tens} value={this.props.data.seconds[0]} key={'seconds.tens'}/>
                    ]
                }
                {this.props.coords.weekDay &&
                    <ImageElement el={this.props.coords.weekDay} value={this.props.data.weekDay} />
                }
                {this.props.coords.dateDay &&
                    <BlockElement el={this.props.coords.dateDay} value={this.props.data.day.toString().length === 1 && this.props.coords.monthandday.TwoDigitsDay ? '0' + this.props.data.day : this.props.data.day} />
                }
                {this.props.coords.dateMonth &&
                    <BlockElement el={this.props.coords.dateMonth} value={this.props.data.month.toString().length === 1 && this.props.coords.monthandday.TwoDigitsMonth ? '0' + this.props.data.month : this.props.data.month} />
                }
                {this.props.coords.dateOneLine &&
                    <BlockElement el={this.props.coords.dateOneLine.Number} value={this.props.data.month.toString().length === 1 && this.props.coords.monthandday.TwoDigitsMonth ? '0' + this.props.data.month : this.props.data.month} extra={{secondPart: this.props.data.day.toString().length === 1 && this.props.coords.monthandday.TwoDigitsDay ? '0' + this.props.data.day : this.props.data.day, DelimiterImageIndex: this.props.coords.dateOneLine.DelimiterImageIndex}}/>
                }
                {this.props.coords.batteryIcon && 
                    <ImageElement el={this.props.coords.batteryIcon} value={Math.round(this.props.data.battery / (100 / (this.props.coords.batteryIcon.ImagesCount - 1)))} />
                }
                {this.props.coords.batteryText &&
                    <BlockElement el={this.props.coords.batteryText} value={this.props.data.battery} />
                }
                {this.props.coords.batteryScale &&
                    <SegmentsElement el={this.props.coords.batteryScale} value={this.props.data.battery} maxValue={100} />
                }
                {/* Analog */}
                {this.props.coords.statAlarm &&
                    <StatusElement el={this.props.coords.statAlarm} value={this.props.data.alarm} />
                }
                {this.props.coords.statBt &&
                    <StatusElement el={this.props.coords.statBt} value={this.props.data.bluetooth} />
                }
                {this.props.coords.statDnd &&
                    <StatusElement el={this.props.coords.statDnd} value={this.props.data.dnd} />
                }
                {this.props.coords.statLock &&
                    <StatusElement el={this.props.coords.statLock} value={this.props.data.lock} />
                }
                {this.props.coords.actCal &&
                    <BlockElement el={this.props.coords.actCal} value={this.props.data.calories} />
                }
                {this.props.coords.actSteps &&
                    <BlockElement el={this.props.coords.actSteps} value={this.props.data.steps} />
                }
                {this.props.coords.actStepsGoal &&
                    <BlockElement el={this.props.coords.actStepsGoal} value={this.props.data.stepsGoal} />
                }
                {this.props.coords.actPulse &&
                    <BlockElement el={this.props.coords.actPulse} value={this.props.data.pulse} />
                }
                {this.props.coords.actDistance &&
                    <BlockElement el={this.props.coords.actDistance} value={this.props.data.distance[0]} extra={{secondPart: this.props.data.distance[1], DelimiterImageIndex: this.props.coords.actDistance.DecimalPointImageIndex}}/>
                }
                {this.props.coords.stepsLinear &&
                    <SegmentsElement el={this.props.coords.stepsLinear} value={this.props.data.steps} maxValue={this.props.data.stepsGoal} />
                }
                {/* Steps progress circle */}
                {this.props.coords.stepsGoal && this.props.data.steps >= this.props.data.stepsGoal &&
                    <ImageElement el={this.props.coords.stepsGoal} />
                }
                {this.props.coords.weathericon && (
                    this.props.coords.weathericon.CustomIcon ? <img src={$(this.props.coords.weathericon.CustomIcon.ImageIndex + this.props.data.weathericon).src} style={{top: this.props.coords.weathericon.CustomIcon.Y + 'px', left: this.props.coords.weathericon.CustomIcon.X + 'px'}}/> : <img src={$('weather').src} style={{top: this.props.coords.weathericon.Coordinates.Y + 'px', left: this.props.coords.weathericon.Coordinates.X + 'px'}}/>
                )}
                {this.props.coords.weatherDay && !this.props.data.weatherAlt &&
                    <BlockElement el={this.props.coords.weatherDay} value={this.props.data.temp[0]} />
                }
                {this.props.coords.weatherNight && !this.props.data.weatherAlt &&
                    <BlockElement el={this.props.coords.weatherNight} value={this.props.data.temp[1]} />
                }
                {this.props.coords.weatherDayAlt && this.props.data.weatherAlt &&
                    <BlockElement el={this.props.coords.weatherDayAlt} value={this.props.data.temp[0]}/>
                }
                {this.props.coords.weatherNightAlt && this.props.data.weatherAlt &&
                    <BlockElement el={this.props.coords.weatherNightAlt} value={this.props.data.temp[1]}/>
                }
                {this.props.coords.weatherCurrent &&
                    <BlockElement el={this.props.coords.weatherCurrent} value={this.props.data.temp[0]} />
                }
                {this.props.coords.weatherOneLine &&
                    <BlockElement el={this.props.coords.weatherOneLine} value={this.props.data.temp[0]} extra={{secondPart: this.props.data.temp[1], DelimiterImageIndex: this.props.coords.weatherOneLine.DelimiterImageIndex}} />
                }
                {this.props.coords.weatherAirIcon &&
                    <ImageElement el={this.props.coords.weatherAirIcon} />
                }
                {this.props.coords.weatherAirText &&
                    <BlockElement el={this.props.coords.weatherAirText} value={this.props.data.air} />
                }
                {this.props.coords.Animation &&
                    <ImageElement el={this.props.coords.Animation.AnimationImage} value={this.props.data.animation} />
                }
            </div>
        );
    }
}

function updateWatchface() {
    ReactDOM.render(
        <Watchface coords={wfe.coords} data={wfe.data} />,
        document.getElementById('new_watchface')
    );
}
// Костыль
// setInterval(updateWatchface, 1000);

export default updateWatchface;