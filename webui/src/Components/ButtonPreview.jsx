import React from 'react'
import classnames from 'classnames'
import { Buffer } from 'buffer'

export function dataToButtonImage(data) {
	const sourceData = Buffer.from(data)
	const imageSize = Math.sqrt(sourceData.length / 4)

	const bmpHeaderSize = 138
	const bmpHeader = Buffer.alloc(bmpHeaderSize, 0)
	bmpHeader.write('BM', 0, 2) // flag
	bmpHeader.writeUInt32LE(sourceData.length + bmpHeaderSize, 2) // filesize
	bmpHeader.writeUInt32LE(0, 6) // reserved
	bmpHeader.writeUInt32LE(bmpHeaderSize, 10) // data start

	bmpHeader.writeUInt32LE(124, 14) // header info size
	bmpHeader.writeUInt32LE(imageSize, 18) // width
	bmpHeader.writeInt32LE(imageSize * -1, 22) // height
	bmpHeader.writeUInt16LE(1, 26) // planes
	bmpHeader.writeUInt16LE(32, 28) // bits per pixel
	bmpHeader.writeUInt32LE(3, 30) // compress
	bmpHeader.writeUInt32LE(sourceData.length, 34) // data size
	bmpHeader.writeUInt32LE(Math.round(39.375 * imageSize), 38) // hr
	bmpHeader.writeUInt32LE(Math.round(39.375 * imageSize), 42) // vr
	bmpHeader.writeUInt32LE(0, 46) // colors
	bmpHeader.writeUInt32LE(0, 50) // importantColors
	bmpHeader.writeUInt32LE(0x000000ff, 54) // Red Bitmask
	bmpHeader.writeUInt32LE(0x0000ff00, 58) // Green Bitmask
	bmpHeader.writeUInt32LE(0x00ff0000, 62) // Blue Bitmask
	bmpHeader.writeUInt32LE(0xff000000, 66) // Alpha Bitmask
	bmpHeader.write('sRGB', 70, 4) // colorspace

	return 'data:image/bmp;base64,' + Buffer.concat([bmpHeader, sourceData]).toString('base64')
}

export const BlackImage = dataToButtonImage(Buffer.alloc(24 * 24 * 4))
export const RedImage = dataToButtonImage(Buffer.alloc(24 * 24 * 4, Buffer.from([255, 0, 0, 0])))

export const ButtonPreview = React.memo(function (props) {
	const classes = {
		bank: true,
		fixed: !!props.fixedSize,
		drophere: props.canDrop,
		drophover: props.dropHover,
		draggable: !!props.dragRef,
		selected: props.selected,
		clickable: !!props.onClick,
		right: !!props.right,
	}

	return (
		<div
			ref={props.dropRef}
			className={classnames(classes)}
			onMouseDown={() => props?.onClick?.(props.index, true)}
			onMouseUp={() => props?.onClick?.(props.index, false)}
			onTouchStart={(e) => {
				e.preventDefault()
				props?.onClick?.(props.index, true)
			}}
			onTouchEnd={(e) => {
				e.preventDefault()
				props?.onClick?.(props.index, false)
			}}
			onTouchCancel={(e) => {
				e.preventDefault()
				e.stopPropagation()

				props?.onClick?.(props.index, false)
			}}
			onContextMenu={(e) => {
				e.preventDefault()
				e.stopPropagation()
				return false
			}}
		>
			<div
				className="bank-border"
				ref={props.dragRef}
				style={{
					backgroundImage: `url(${props.preview})`,
					backgroundSize: '0%',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat'
				}}
			>
				<img
					width={72}
					height={72}
					src={props.preview ?? BlackImage}
					alt={props.alt}
					title={props.title}
				/>
			</div>
		</div>
	)
})
