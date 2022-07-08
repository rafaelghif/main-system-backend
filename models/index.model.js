const { connDatabase } = require("../config/database.config")
const { Op } = require("sequelize")

/* JSON Data */
const departmentDatas = require('../datas/department.json')
const roleDatas = require('../datas/role.json')
const userDatas = require('../datas/user.json')
const lineDatas = require('../datas/line.json')

/* Model */
const User = require("./user.model")
const Department = require("./department.model")
const Role = require("./role.model")
const UserRole = require("./userRole.model")
const Checker = require("./checker.model")
const Line = require("./Line.model")
const Inspection = require("./Inspection.model")
const CheckerPart = require("./CheckerPart.model")
const Worksheet = require("./worksheet.model")
const WorksheetDetail = require("./worksheetDetail.model")

const model = {}

model.User = User
model.Department = Department
model.Role = Role
model.UserRole = UserRole

model.Line = Line
model.Checker = Checker
model.CheckerPart = CheckerPart
model.Inspection = Inspection
model.Worksheet = Worksheet
model.WorksheetDetail = WorksheetDetail

// connDatabase.sync({ force: true }).then(() => {
//     initialValue()
// })

connDatabase.sync()

const initialValue = async () => {
    try {
        const responseDepartment = await Department.bulkCreate(departmentDatas)
        const responseRole = await Role.bulkCreate(roleDatas)
        const responseUser = await User.bulkCreate(userDatas)

        responseUser.forEach(async (element) => {
            await User.update({
                DepartmentId: responseDepartment[2].id
            }, {
                where: {
                    id: element.id
                }
            })

            await UserRole.create({
                UserId: element.id,
                RoleId: responseRole[0].id,
                createdBy: "SYSTEM",
                updatedBy: "SYSTEM"
            })
        });

        const productionDepartment = await Department.findAll({
            where: {
                [Op.or]: [{
                    abbreviation: 'PD1'
                }, {
                    abbreviation: 'PD2'
                }]
            },
            order: [
                ['abbreviation', 'ASC']
            ]
        })

        lineDatas.forEach(async (element) => {
            element.DepartmentId = element.DepartmentId === "PD1" ? productionDepartment[0].id : productionDepartment[1].id
            await model.Line.create(element)
        })

    } catch (err) {
        console.log(err)
    }
}

model.Department.hasMany(model.User)
model.User.belongsTo(model.Department)
model.User.belongsToMany(model.Role, { through: model.UserRole, foreignKey: 'UserId' })
model.Role.belongsToMany(model.User, { through: model.UserRole, foreignKey: 'RoleId' })

model.Department.hasMany(model.Line)
model.Line.belongsTo(model.Department)
model.Line.hasMany(model.Checker)
model.Checker.belongsTo(model.Line)

model.Checker.hasOne(model.Inspection)
model.Inspection.belongsTo(model.Checker)

model.Checker.hasMany(model.CheckerPart)
model.CheckerPart.belongsTo(model.Checker)

model.Checker.hasOne(model.Worksheet)
model.Worksheet.belongsTo(model.Checker)
model.Worksheet.hasMany(model.WorksheetDetail)
model.WorksheetDetail.belongsTo(model.Worksheet)

module.exports = model