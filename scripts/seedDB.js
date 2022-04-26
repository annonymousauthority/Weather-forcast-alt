const {Location, Forcast}  = require('../src/model')

seed()

async function seed(){
    //create table
    await Location.sync({force: true})
    await Forcast.sync({force: true})

    await Promise.all([
        Location.create({
            id: 1,
            longitude: 113.2,
            latitude:23.1,
            slug: "mywork",
            min: 23,
            max: 32,
            createdAt: "2022-04-25"
        }),
        Location.create({
            id: 2,
            longitude: 113.2,
            latitude:23.1,
            slug: "mywork",
            min: 23,
            max: 32,
            createdAt: "2022-04-26"
        }),
        Location.create({
            id: 3,
            longitude: 113.2,
            latitude:23.1,
            slug: "mywork",
            min: 23,
            max: 32,
            createdAt: "2022-04-27"
        }),
        Location.create({
            id: 4,
            longitude: 113.2,
            latitude:23.1,
            slug: "myhome",
            min: 23,
            max: 32,
            createdAt: "2022-04-25"
        }),
        Location.create({
            id: 5,
            longitude: 113.2,
            latitude:23.1,
            slug: "myhome",
            min: 23,
            max: 32,
            createdAt: "2022-04-26"
        }),
        Location.create({
            id: 6,
            longitude: 113.2,
            latitude:23.1,
            slug: "myhome",
            min: 23,
            max: 32,
            createdAt: "2022-04-27"
        })
    ])
}