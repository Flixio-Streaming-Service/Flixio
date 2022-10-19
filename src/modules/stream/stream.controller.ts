import { Router, Response, Request, NextFunction } from 'express'
import WebTorrent, { Torrent, TorrentFile } from 'webtorrent'

const router = Router()
const client = new WebTorrent()

let state = {
    progress: 0,
    downloadSpeed: 0,
    ratio: 0 
}

let error

client.on('error', (err: Error) => {
    console.error(err.message)
    error = err.message
})

client.on('torrent', () => {
   
})

router.get('/add/:magnet', (req, res: Response) => {
    const magnet = req.params.magnet

    client.add(magnet, (torrent) => {
        const files = torrent.files.map(data => ({
            name: data.name,
            length: data.length
        }))

        res.status(200).send(files)
    })
})


router.get('/stats', (req, res: Response) => {
    state = {
        progress: Math.round(client.progress * 100 * 100) / 100,
        downloadSpeed: client.downloadSpeed,
        ratio: client.ratio
    }
    res.status(200).send(state)
})

interface IStreamRequest extends Request {
    params: {
        magnet: string,
        fileName: string
    }
    headers: {
        range: string
    }
}

router.get('/:magnet/:fileName', (req: IStreamRequest, res: Response, next: NextFunction) => {
    const {
        params: { magnet, fileName },
        headers: { range }
    } = req

    if(!range){
        const err = new Error('Range is not defined, please make request from HTML5 player')
        return next(err)
    }

    const torrentFile = client.get(magnet) as Torrent
    let file = <TorrentFile>{}

    for(let i = 0; i < torrentFile.files.length; i++){
        const currentTorrentPiece = torrentFile.files[i]
        
        if(currentTorrentPiece.name === fileName){
            file = currentTorrentPiece
        }
    }

    const fileSize = file.length
    const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-')

    const start = Number(startParsed)
    const end = endParsed ? Number(endParsed) : fileSize - 1

    const chunkSize = end - start + 1

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
    }
   
    res.writeHead(206, headers)

    const streamPosition = {
        start,
        end
    }

    const stream = file.createReadStream(streamPosition)

    stream.pipe(res) 

    stream.on('error', err => {
        return next(err)
    })

})

export default router