const express = require('express')
const router = express.Router()
const Layout = require('../models/layoutModel')

const savelayout = async (req, res) => {
    const { userId, layout } = req.body
    try {
        let existingLayout = await Layout.findOne({ userId })

        if (existingLayout) {
            existingLayout.layout = layout
            existingLayout.updatedAt = Date.now()
            await existingLayout.save()
        } else {
            const newLayout = new Layout({ userId, layout })
            await newLayout.save()
        }

        res.status(200).json({ message: 'Layout saved successfully!' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error saving layout', error })
    }
}

const loadLayout = async (req, res) => {
    const { userId } = req.query
    console.log(userId,'lol')
    try {
        const layout = await Layout.findOne({ userId })
        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' })
        }
        res.status(200).json(layout)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error loading layout', error })
    }
}

module.exports = {savelayout,loadLayout}
