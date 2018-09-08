const graphql = require('graphql');
const _ = require('lodash');
const Circle = require('../models/circle');
const User = require('../models/user');
const Image = require('../models/image');
const CircleFriends = require('../models/circleFriends');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull } = graphql;

const ImageType = new GraphQLObjectType({
    name: 'Image',
    fields: () => ({
        id: { type: GraphQLID },
        url: { type: GraphQLString },
    })
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        gender: { type: GraphQLString },
        social_id: { type: GraphQLString },
        social_type: { type: GraphQLString },
        image: {
            type: ImageType,
            resolve(parent, args) {
                return Image.findById(parent.image_id);
            }
        },
        circles: {
            type: new GraphQLList(CircleType),
            resolve(parent, args) {
                return Circle.find({ user_id: parent.id });
            }
        }
    })
});

const CircleType = new GraphQLObjectType({
    name: 'Circle',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        image: {
            type: ImageType,
            resolve(parent, args) {
                return Image.findById(parent.image_id);
            }
        },
        friends: {
            type: new GraphQLList(UserType)
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        cricle: {
            type: CircleType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Circle.findById(args.id);

            }
        },
        cricles: {
            type: new GraphQLList(CircleType),
            resolve(parent, args) {
                return Circle.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addImage: {
            type: ImageType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let image = new Image({
                    url: args.url,
                });

                return image.save();
            }
        },
        addCircle: {
            type: CircleType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                user_id: { type: new GraphQLNonNull(GraphQLString) },
                image_id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let circle = new Circle({
                    name: args.name,
                    user_id: args.user_id,
                    image_id: args.image_id
                });

                return circle.save();
            }
        },
        addUser: {
            type: UserType,
            args: {
                fname: { type: new GraphQLNonNull(GraphQLString) },
                lname: { type: new GraphQLNonNull(GraphQLString) },
                gender: { type: new GraphQLNonNull(GraphQLString) },
                image_id: { type: new GraphQLNonNull(GraphQLString) },
                social_id: { type: new GraphQLNonNull(GraphQLString) },
                social_type: { type: new GraphQLNonNull(GraphQLString) }
            },

            resolve(parent, args) {

                let user = new User({
                    fname: args.fname,
                    lname: args.lname,
                    gender: args.gender,
                    social_id: args.social_id,
                    social_type: args.social_type,
                    image_id: args.image_id
                });

                var savedUser = user.save();

                let everyOneCircle = new Circle({
                    user_id: user._id,
                    name: "Everyone",
                    image_id: "5b913e8092438000e8003d3d"
                })
                everyOneCircle.save();

                let fashionCircle = new Circle({
                    user_id: user._id,
                    name: "Fashion",
                    image_id: "5b913e8092438000e8003d3d"
                })
                fashionCircle.save();

                let travelCircle = new Circle({
                    user_id: user._id,
                    name: "Travel",
                    image_id: "5b913e8092438000e8003d3d"
                })
                travelCircle.save();

                return savedUser;
            }
        },
        addFriend: {
            type: CircleType,
            args: {
                circle_id: { type: new GraphQLNonNull(GraphQLString) },
                friend_id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {

                return new Promise((resolve, reject) => {
                    let friend = new CircleFriends({
                        friend_id: args.friend_id,
                        fname: "Ahmed",
                        lname: "Said"
                    });
                    // Circle.findByIdAndUpdate({ id: args.circle_id }, { $push: { friends: friend } }).exec((err, res) => {
                    //     if (err) reject(err)
                    //     else resolve(res)
                    // });

                    Circle.findOne({ _id: args.circle_id }, (err, circle) => {
                        //console.log(circle.friends);
                        circle.friends.push(friend);
                        circle.save(function (err) {
                            if (err) { 
                                reject(err);
                                console.log(err);
                            } else {
                                resolve(circle);
                            }
                        });
                    })

                });

            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});