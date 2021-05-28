import { TemperatureMDB } from './temperatureMDB.entity';

export const temperatureProvidersMDB = [
  {
    provide: 'MDB_TEMPERATURE_REPOSITORY',
    useValue: TemperatureMDB,
  },
];
