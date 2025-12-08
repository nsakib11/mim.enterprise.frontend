import { Unit } from "@/utils/types";

interface StatisticsCardsProps {
    units: Unit[];
}

export default function StatisticsCards({ units }: StatisticsCardsProps) {
    const totalUnits = units.length;
    const activeUnits = units.filter(unit => unit.active).length;
    const unitsWithBanglaName = units.filter(unit => unit.nameBn).length;
    const inactiveUnits = units.filter(unit => !unit.active).length;

    // Get unit name suggestions based on common units
    const commonUnits = [
        "Piece", "Box", "Packet", "Carton", "Set", "Pair", "Dozen",
        "Meter", "Foot", "Inch", "Kilogram", "Gram", "Liter", "Gallon",
        "Bundle", "Roll", "Sheet", "Bag", "Bottle", "Can", "Tube"
    ];

    // Find units that are missing from common list
    const missingCommonUnits = commonUnits.filter(
        commonUnit => !units.some(unit => unit.name.toLowerCase() === commonUnit.toLowerCase())
    );

    return (
        <div className="mt-8">

            {/* Unit Analysis */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Unit Status Overview</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-3 bg-green-100"></div>
                                <span className="text-sm text-gray-700">Active Units</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-medium text-gray-900">{activeUnits}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                    ({totalUnits > 0 ? ((activeUnits / totalUnits) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-3 bg-red-100"></div>
                                <span className="text-sm text-gray-700">Inactive Units</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-medium text-gray-900">{inactiveUnits}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                    ({totalUnits > 0 ? ((inactiveUnits / totalUnits) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-3 bg-blue-100"></div>
                                <span className="text-sm text-gray-700">With Bangla Name</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-medium text-gray-900">{unitsWithBanglaName}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                    ({totalUnits > 0 ? ((unitsWithBanglaName / totalUnits) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}