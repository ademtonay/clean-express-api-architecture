import {
	InferAttributes,
	InferCreationAttributes,
	Model,
	CreationOptional,
	DataTypes,
} from 'sequelize'
import Postgres from '../databases/Postgres'

class Example extends Model<
	InferAttributes<Example>,
	InferCreationAttributes<Example>
> {
	declare readonly id?: CreationOptional<string>

	declare email: string
	declare name: string
	declare lastname: string

	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

Example.init(
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			unique: true,
			defaultValue: DataTypes.UUIDV4,
		},
		email: {
			type: DataTypes.STRING(128),
			allowNull: false,
			unique: {
				msg: 'Can not add an e-mail that is already exist.',
				name: 'email',
			},
			validate: {
				isEmail: {
					msg: 'Provided e-mail is invalid.',
				},
				notNull: {
					msg: 'E-mail can not be empty.',
				},
			},
		},
		name: {
			type: DataTypes.STRING(128),
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Name can not be empty',
				},
			},
		},
		lastname: {
			type: DataTypes.STRING(128),
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Password can not be empty',
				},
			},
		},
		createdAt: {
			field: 'created_at',
			type: DataTypes.DATE,
		},
		updatedAt: {
			field: 'updated_at',
			type: DataTypes.DATE,
		},
	},
	{
		sequelize: Postgres,
		tableName: 'example',
		indexes: [
			{
				fields: ['id'],
			},
		],
		hooks: {
			// this hook will be called when an instance is created or updated
			beforeSave: async (example) => {
				// add your business logic before save
			},
			beforeCreate: async (example) => {
				// add your business logic before create
			},
		},
	},
)

export default Example
