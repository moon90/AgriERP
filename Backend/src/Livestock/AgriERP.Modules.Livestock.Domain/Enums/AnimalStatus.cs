using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Domain.Enums
{
    public enum AnimalStatus
    {
        Active,
        Sick,
        SoldLive,     // Kurbani ba live sale hoye gele
        Slaughtered,  // Mangsho bananor jonno jobai kora hole
        Archived
    }
}
